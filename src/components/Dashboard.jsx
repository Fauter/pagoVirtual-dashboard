
    import React, { useState, useEffect } from 'react';
    import moment from 'moment';
    import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
    import axios from 'axios';
    import Login from './Login'; 

    const Dashboard = () => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [users, setUsers] = useState([]);
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(true);
      const [openId, setOpenId] = useState(null);
      const [simulacionDias, setSimulacionDias] = useState(1);
      const [fechaSimulada, setFechaSimulada] = useState(moment().format('YYYY-MM-DD'));
    
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        setError('No hay token disponible. Debes iniciar sesión.');
        return;
        }
        setIsAuthenticated(true);

        const fetchUsers = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No hay token disponible. Debes iniciar sesión.');
            return;
          }
    
          try {
            const response = await axios.get('https://api.ahorrovirtual.com/api/auth/users', {
              headers: {
                'x-auth-token': token,
              },
            });
            setUsers(response.data);
          } catch (err) {
            console.error('Error al obtener los usuarios:', err.response.data);
            setError('Error al obtener los usuarios: ' + (err.response?.data?.msg || err.message));
          }
        };
    
        fetchUsers();
      }, []);

      if (error) return <div>{error}</div>;

      const toggleAhorros = (id) => {
        setOpenId(openId === id ? null : id);
      };

      const simularDia = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token disponible. Debes iniciar sesión.');
          return;
        }
    
        try {
          const response = await axios.post(
            'https://api.ahorrovirtual.com/api/simular-dia',
            { dias: simulacionDias }, 
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          const nuevaFecha = response.data.fecha;
          setFechaSimulada(nuevaFecha);
          alert('Simulación de día ejecutada: ' + nuevaFecha);
        } catch (error) {
          console.error('Error al simular el día:', error);
          setError('Error al simular el día: ' + (error.response?.data || error.message));
        }
      };

      const resetDia = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError('No hay token disponible. Debes iniciar sesión.');
            return;
        }
        try {
            const response = await axios.post(
              'https://api.ahorrovirtual.com/api/reset-fecha',
              {},
              {
                headers: {
                  'x-auth-token': token,
                },
              }
            );
            const nuevaFecha = response.data.fecha;
            setFechaSimulada(nuevaFecha);
            alert('Fecha reseteada a: ' + nuevaFecha);
          } catch (error) {
              console.error('Error al resetear la fecha:', error);
              setError('Error al resetear la fecha: ' + (error.response?.data || error.message));
        }
      }

      const eliminarAhorro = async (ahorroId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay token disponible. Debes iniciar sesión.");
            return;
        }
        console.log("Eliminando ahorro con ID:", ahorroId);
        try {
            await axios.delete(`https://api.ahorrovirtual.com/api/auth/ahorros/todos/${ahorroId}`, {
                headers: {
                    'x-auth-token': token,
                },
            });
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.ahorros) {
                        return {
                            ...user,
                            ahorros: user.ahorros.filter((ahorro) => ahorro._id !== ahorroId),
                        };
                    }
                    return user;
                })
            )
        } catch (err) {
            console.error('Error al eliminar el ahorro:', err.response.data);
            setError('Error al eliminar el ahorro: ' + (err.response?.data?.msg || err.message));
        }
      }
    
      return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: "'Work Sans', 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                        <div className="flex min-w-72 flex-col gap-3">
                            <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">Dashboard de Administrador</p>
                            <p className="text-[#4e7397] text-sm font-normal leading-normal">Explorador de Usuarios y Ahorros</p>
                        </div>
                        </div>
                        <div className="pb-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={simularDia}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Simular Día
                                </button>
                                <button
                                    onClick={resetDia}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                >
                                    Reset Día
                                </button>
                                <div>{fechaSimulada}</div>
                            </div>
                        </div>
                        <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Usuarios</h2>
                        <div className="px-4 py-3">
                        <label className="flex flex-col min-w-40 h-12 w-full">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                            <div className="text-[#4e7397] flex border-none bg-[#e7edf3] items-center justify-center pl-4 rounded-l-xl border-r-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                                ></path>
                                </svg>
                            </div>
                            <input
                                placeholder="Buscar"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border-none bg-[#e7edf3] focus:border-none h-full placeholder:text-[#4e7397] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                            />
                            </div>
                        </label>
                        </div>
                        <div className="px-4 py-3 @container">
                            <div className="flex overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                                <div className="flex justify-center">
                                    <table className="flex-1">
                                        <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-4 py-3 text-center text-[#0e141b] w-[400px] text-sm font-medium leading-normal">ID</th>
                                            <th className="px-4 py-3 text-center text-[#0e141b] w-[400px] text-sm font-medium leading-normal">Nombre Completo</th>
                                            <th className="px-4 py-3 text-center text-[#0e141b] w-[400px] text-sm font-medium leading-normal">Correo Electrónico</th>
                                            <th className="px-4 py-3 text-center text-[#0e141b] w-[400px] text-sm font-medium leading-normal">Ahorros Totales</th>
                                            <th className="px-4 py-3 text-center text-[#0e141b] w-[400px] text-sm font-medium leading-normal">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.slice().reverse().map((user) => (
                                            <React.Fragment key={user.id}>
                                            <tr>
                                                <td className="px-4 py-3 border-t border-[#d0dbe7] text-sm font-medium leading-normal text-center">{user._id}</td>
                                                <td className="px-4 py-3 border-t border-[#d0dbe7] text-sm font-medium leading-normal text-center">{user.firstName + " " + user.lastName}</td>
                                                <td className="px-4 py-3 border-t border-[#d0dbe7] text-sm font-medium leading-normal text-center">{user.email}</td>
                                                <td className="px-4 py-3 border-t border-[#d0dbe7] text-sm font-medium leading-normal text-center">{user.ahorros.length}</td>
                                                <td className="px-4 py-3 border-t border-[#d0dbe7] text-center">
                                                <button 
                                                    onClick={() => toggleAhorros(user._id)} 
                                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                                >
                                                    Ver
                                                </button>
                                                </td>
                                            </tr>
                                            {openId === user._id && ( 
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-3 border-t border-[#d0dbe7] text-sm font-medium leading-normal">
                                                        <div className="p-4 bg-gray-100 rounded">
                                                            <h4 className="font-semibold mb-3">Ahorros de {user.firstName} {user.lastName}:</h4>
                                                                {user.ahorros.length === 0 ? ( 
                                                                        <p className="text-gray-500">No hay ahorros disponibles para este usuario.</p>
                                                                    ) : (
                                                                <table className="min-w-full bg-white rounded shadow">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Nombre</th>
                                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Dirección</th>
                                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Monto</th>
                                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Fecha De Pago</th>
                                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {user.ahorros.map((ahorro, index) => (
                                                                            <tr key={index} className="border-b">
                                                                                <td className="px-4 py-2 text-sm text-gray-700">{ahorro.nombre}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-700">{ahorro.direccion}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-700">${ahorro.monto}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                                {new Date(ahorro.fechaPago).toLocaleDateString("es-ES")}
                                                                                </td>
                                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                                    <button 
                                                                                        onClick={() => {
                                                                                            if (window.confirm("¿Estás seguro de que deseas eliminar este ahorro?")) {
                                                                                                eliminarAhorro(ahorro._id); 
                                                                                            }
                                                                                        }}
                                                                                        className="text-red-600 hover:text-red-800 focus:outline-none"
                                                                                    >
                                                                                        Eliminar
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </React.Fragment>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 @container">
                            <div className="flex items-center justify-center py-6 rounded-xl border border-dashed border-[#d0dbe7] bg-white hover:border-solid hover:border-[#1980e6] group cursor-pointer w-full">
                                <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                    <path
                                        d="M128,16A112,112,0,1,0,240,128,112.13,112.13,0,0,0,128,16Zm0,200a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-88a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V136H104a8,8,0,0,1,0-16h16V104a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,128Z"
                                    ></path>
                                    </svg>
                                </div>
                                <p className="text-[#0e141b] tracking-light text-sm font-bold leading-normal">Upload Data</p>
                                <p className="text-[#4e7397] tracking-light text-sm font-normal leading-normal">Add a new data entry</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    };
    
    export default Dashboard;