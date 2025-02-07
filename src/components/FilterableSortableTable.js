import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Stack, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment-timezone';

const bankLogos = {
  'BB': '/bb.png', // Adicione os logos dos bancos correspondentes aqui
  'OtherBank': '/otherbank.png'
};

const FilterableSortableTable = ({ onRowClick }) => {
  const [tableData, setTableData] = useState([]);
  const onlineAudioRef = useRef(null);
  const offlineAudioRef = useRef(null);
  const previousStatusRef = useRef({}); // Para armazenar o status anterior de cada cliente
  const [userInteracted, setUserInteracted] = useState(false); // Estado para controlar se o usuário interagiu

  const getStatusAvatar = (isOnline) => (
    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: isOnline ? 'green' : 'gray' }}>
      {isOnline ? 'ON' : 'OFF'}
    </Avatar>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/nfct');
        console.log('TableData:', response.data); // Log para verificar os dados recebidos do servidor
        setTableData(response.data);
      } catch (error) {
        console.error('Erro ao chamar /api/nfct:', error.message);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 500); // Polling interval de 0.5 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTableData((prevData) =>
        prevData.map((client) => {
          const isCollectorOnline = client.IS_COLLECTOR_ONLINE;
          const isBrowserOnline = client.IS_BROWSER_ONLINE;

          console.log('Client ID:', client.ID);
          console.log('isCollectorOnline:', isCollectorOnline);
          console.log('isBrowserOnline:', isBrowserOnline);

          const status = isCollectorOnline || isBrowserOnline ? 'ONLINE' : 'OFFLINE';

          if (previousStatusRef.current[client.id] !== status) {
            previousStatusRef.current[client.id] = status;
            if (status === 'ONLINE' && userInteracted) {
              onlineAudioRef.current.play().catch(() => {});
            } else if (userInteracted) {
              offlineAudioRef.current.play().catch(() => {});
            }
          }

          return { ...client, status };
        })
      );
    }, 500); // Polling interval de 0.5 segundos

    return () => clearInterval(interval);
  }, [tableData, userInteracted]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="data table">
        <TableHead>
          <TableRow>
            <TableCell>BANCO</TableCell>
            <TableCell>PC</TableCell>
            <TableCell>USER</TableCell>
            <TableCell>DT_COLLECTOR</TableCell>
            <TableCell>DT_BROWSER</TableCell>
            <TableCell>STATUSRESUMO</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(tableData) && tableData.map((row) => (
            <TableRow
              key={row.ID}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>
                <img src={bankLogos[row.BANCO] || '/default.png'} alt={row.BANCO} width={24} height={24} />
              </TableCell>
              <TableCell>{row.PC}</TableCell>
              <TableCell>{row.USER}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  {getStatusAvatar(row.IS_COLLECTOR_ONLINE)}
                  <Typography variant="body2">{formatDate(row.DT_COLLECTOR)}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  {getStatusAvatar(row.IS_BROWSER_ONLINE)}
                  <Typography variant="body2">{formatDate(row.DT_BROWSER)}</Typography>
                </Stack>
              </TableCell>
              <TableCell>{row.STATUSRESUMO}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <audio ref={onlineAudioRef} src="/online.mp3" />
      <audio ref={offlineAudioRef} src="/offline.mp3" />
    </TableContainer>
  );
};

export default FilterableSortableTable;
    