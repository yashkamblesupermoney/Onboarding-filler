import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SendMobileOtp from './components/pages/SendMobileOtp'
import VerifyOtp from './components/pages/VerifyOtp'
import { useDispatch, useSelector } from 'react-redux'
import './index.css';
import { RootState } from './store/store'
import Layout from './components/layout/Layout'
import SetPin from './components/pages/SetPin'
import Loader from './components/pages/Loader'
import { Login } from './components/pages/Login'
import { ResendLogin } from './components/pages/ResendLogin'
import { RecoveryLinkSent } from "./components/pages/RecoveryLinkSent";
import { ResetPassword } from './components/pages/ResetPassword'
import { useEffect } from 'react';
import { setTheme } from './store/themeSlice';

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setTheme(e.matches ? 'dark' : 'light'));
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

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
            <Route path="/recoveryLinkSent" element={<RecoveryLinkSent />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />
            <Route path="/setpin" element={<SetPin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
