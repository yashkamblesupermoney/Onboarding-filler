import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SendMobileOtp from './components/pages/SendMobileOtp'
import VerifyOtp from './components/pages/VerifyOtp'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Layout from './components/layout/Layout'
import SetPin from './components/pages/SetPin'
import Loader from './components/pages/Loader'
import { Login } from './components/pages/Login'
import { ResendLogin } from './components/pages/ResendLogin'

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode)

  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Loader/>
      <Router>
        <Routes>
          {/* Redirect root to /sendmobileotp */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Layout-wrapped routes */}
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path='/resendLogin' element={<ResendLogin/>}/>
            <Route path="/sendmobileotp" element={<SendMobileOtp />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />
            <Route path="/setpin" element={<SetPin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
