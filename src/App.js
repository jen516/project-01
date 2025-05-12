import logo from './logo.svg';
import './App.css';
import Board from './componenets/Board';
import Login from './componenets/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Board />} />
        <Route path="/login" element={<Login />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>);
}

export default App;
