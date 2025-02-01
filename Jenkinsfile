pipeline {
    agent any

    environment {
        REGISTRY = "asia-southeast1-docker.pkg.dev"
        PROJECT_ID = "sigma-zodiac-448315-p7"
        IMAGE_TAG = "latest"
        REPOSITORY_NAME = "frontend"
        FRONTEND_IMAGE = "frontend-app"
        FRONTEND_SERVICE = "frontend-service"
        GOOGLE_APPLICATION_CREDENTIALS = '/home/gcp/artifact_registry.json'
        DOCKER_COMPOSE_PATH = "/home/frontend/docker-compose.yaml"
    }

    stages {
        stage('Authenticate Docker with Google Cloud') {
            steps {
                script {
                    sh 'gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}'
                }
            }
        }

        stage('Clone Frontend Repository') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                    sh '''
                    git config --global --add safe.directory /home/frontend
                    if [ -d "/home/frontend/.git" ]; then
                        echo "Repository exists. Pulling latest changes..."
                        cd /home/frontend
                        git reset --hard origin/production
                        git clean -fd
                        git config pull.rebase true
                        git pull origin production
                    else
                        echo "Repository not found. Cloning..."
                        git clone -b production https://$GITHUB_USER:$GITHUB_TOKEN@github.com/u-credit/frontend.git /home/frontend
                    fi
                    cp /home/env/frontend.env /home/frontend/.env
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'export JAVA_OPTS="-Dorg.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL=86400"'
                sh "docker build -t ${REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/${FRONTEND_IMAGE}:${IMAGE_TAG} /home/frontend"
            }
        }

        stage('Push Frontend Docker Image') {
            steps {
                script {
                    sh '''
                    docker push ${REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy Frontend to Swarm') {
            steps {
                script {
                    sh '''
                    docker pull ${REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    
                    if [ -n "$FRONTEND_SERVICE" ]; then
                        docker stack rm ${FRONTEND_SERVICE} || true
                    fi
                
                    if docker network ls | grep -q ${FRONTEND_SERVICE}_default; then
                        docker network rm ${FRONTEND_SERVICE}_default || true
                    fi
                    sleep 5
                
                    docker stack deploy -c ${DOCKER_COMPOSE_PATH} ${FRONTEND_SERVICE}
                    ''' 
                }
            }
        }
    }
}
