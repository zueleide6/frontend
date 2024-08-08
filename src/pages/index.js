import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterableSortableTable from '../components/FilterableSortableTable';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/nfct');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao chamar /api/nfct:', error.message);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 500); // Polling interval de 0.5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (row) => {
    navigate(`/bb-details/${row.ID}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <FilterableSortableTable data={data} onRowClick={handleRowClick} />
    </Container>
  );
};

export default IndexPage;
