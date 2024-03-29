import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Stack } from '@mui/material';
import Card from '../../partials/Cards/cards';
import { getUserID, getUserType, deleteBudget, addNotif } from '../../api.mjs';


export default function Pie({ category, spent, remaining, budgetId, onBudgetDelete }) {
  const items = [
    { value: spent, label: 'Spent', color: '#C3B1E1' },
    { value: remaining, label: 'Remaining', color: '#442C62'  },
  ];

  const handleDeleteBudget = async (id, category) => {
    try {
      const response = await deleteBudget(id);
      const content = `Deleted budget for ${category}!`;
      const notif = await addNotif(getUserID(), getUserType(), category, content );
      onBudgetDelete();

    } catch (error) {
      console.error('Error deleting notification:', error.message);
    }
  };

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', md: 'column' }}
        alignItems={{ xs: 'center', md: 'center' }}
        justifyContent="space-between"
        sx={{ width: '100%', marginTop: '20px' }}
      >
        <Typography
          style={{
            color: '#0D0447',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: '550',
          }}
        >
          {category}
        </Typography>
        <div onClick={() => handleDeleteBudget(budgetId, category)} className="del">delete</div>

        <PieChart
          series={[
            {
              data: items,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          width={400}
          height={200}
          margin={{ right: 200 }}
        />
      </Stack>
    </Card>
  );
}
