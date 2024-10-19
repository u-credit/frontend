export function stripHtmlTags(input: string): string {
    let text = input.replace(/<[^>]*>/g, '');
    
    text = text.replace(/&nbsp;/g, ' ');
  
    return text.trim();
  }
  