import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/uiSlice';

const ThemeToggle = () => {
    const { theme } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    React.useEffect(() => {
        // Initialize theme from localStorage on mount
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme !== theme) {
            dispatch(setTheme(savedTheme));
        }
    }, [dispatch]);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
    );
};

export default ThemeToggle;
