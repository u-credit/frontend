import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableContainer,
  Paper,
  TableHead,
  colors,
} from '@mui/material';
import { useState, useEffect } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { formatDisplayCalculation } from '@/utils';

export interface Row {
  id: number;
  name: string;
  requiredCredit: number;
  currentCredit: number;
  scheduledCredit: number;
  creditToComplete: number;
  children?: Row[];
}

const color = [
  ['#8BD2EC', '#C0E4F6', '#E5F9FE', '#FFFFFF'],
  ['#FBCCC2', '#FEE5E0', '#FFF8F8', '#FFFFFF'],
  ['#D0F4DE', '#86CB96', '#86CB96', '#86CB96'],
];

function Row(props: {
  row: Row;
  cat: number;
  countRow: number;
  showScheduleCredit?: boolean;
  depth?: number;
  openInitially?: boolean;
}) {
  const {
    row,
    showScheduleCredit = false,
    depth = 0,
    openInitially = false,
    cat,
    countRow,
  } = props;
  const [openGroup, setOpenGroup] = useState(openInitially);

  useEffect(() => {
    if (depth <= 0 && row.children) {
      setOpenGroup(true);
    }
  }, [row.children, depth]);

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          borderBottom: depth === 3 ? '1px solid #eeeeee' : '1px solid #FFFFFF',
          bgcolor: color[cat - 1][depth % 4],
          '& .MuiTableCell-root': {
            border: 'none',
            color: 'black',
            fontWeight: depth === 0 ? 600 : 400,
          },
        }}
      >
        <TableCell
          component="th"
          scope="row"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: `${!row.children ? 20 * depth + 30 : 20 * depth}px`,
          }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenGroup(!openGroup)}
            sx={{
              width: '30px',
              height: '30px',
              padding: 0,
              display: !row.children ? 'none' : 'inline',
            }}
          >
            {openGroup ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
          <div className="pl-1">{row.name}</div>
        </TableCell>
        <TableCell align="center">{row.requiredCredit || '-'}</TableCell>
        <TableCell align="center">{row.currentCredit || '-'}</TableCell>
        {showScheduleCredit && (
          <TableCell align="center">{row.scheduledCredit || '-'}</TableCell>
        )}
        <TableCell align="center">
          {showScheduleCredit
            ? formatDisplayCalculation(
                row.creditToComplete - row.scheduledCredit,
                row.requiredCredit,
              )
            : formatDisplayCalculation(
                row.creditToComplete,
                row.requiredCredit,
              )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={showScheduleCredit ? 5 : 4}>
          <Collapse in={openGroup} timeout="auto" unmountOnExit>
            <Table
              aria-label="groups"
              sx={{ tableLayout: 'fixed', width: '100%' }}
            >
              <colgroup>
                <col style={{ width: '45%' }} />
              </colgroup>
              <TableBody>
                {row.children &&
                  row.children.map((children, index) => (
                    <Row
                      key={index}
                      countRow={index}
                      row={children}
                      showScheduleCredit={showScheduleCredit}
                      depth={depth + 1}
                      openInitially={openInitially}
                      cat={cat}
                    />
                  ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface SummaryTableProps {
  data: Row[];
  showScheduleCredit?: boolean;
}

export default function SummaryTable({
  data,
  showScheduleCredit = false,
}: SummaryTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: 'none',
        boxShadow: 0,
        borderRadius: '10px 10px 0px 0px',
        '& td': { border: 'none', padding: '8px 16px 8px 16px' },
        '& th': { padding: '8px 32px 8px 32px' },
        overflowX: 'auto',
      }}
    >
      <Table
        aria-label="collapsible table"
        sx={{
          minWidth: '730px',
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        <colgroup>
          <col style={{ width: '45%' }} />
        </colgroup>
        <TableHead
          sx={{
            bgcolor: colors.grey[100],
            '.MuiTableCell-root': {
              fontFamily: 'Mitr',
              fontSize: '16px',
              fontWeight: 500,
            },
          }}
        >
          <TableRow>
            <TableCell>หมวดหมู่</TableCell>
            <TableCell align="center">หลักสูตรกำหนด</TableCell>
            <TableCell align="center">คุณมีแล้ว</TableCell>
            {showScheduleCredit && (
              <TableCell align="center">จากตารางเรียน</TableCell>
            )}
            <TableCell align="center">เหลืออีก</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: Row) => (
            <Row
              key={row.id}
              row={row}
              countRow={0}
              showScheduleCredit={showScheduleCredit}
              openInitially={false}
              cat={row.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
