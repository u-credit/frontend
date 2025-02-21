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
import { useState } from 'react';

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

function Row(props: {
  row: Row;
  showScheduleCredit?: boolean;
  depth?: number;
}) {
  const { row, showScheduleCredit = false, depth = 0 } = props;
  const [openGroup, setOpenGroup] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          borderBottom: '1px solid #BFBFBF',
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
              )
            : formatDisplayCalculation(row.creditToComplete)}
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
                      row={children}
                      showScheduleCredit={showScheduleCredit}
                      depth={depth + 1}
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
        // whiteSpace: 'nowrap',
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
              fontSize: '20px',
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
              showScheduleCredit={showScheduleCredit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
