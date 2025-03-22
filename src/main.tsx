import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "antd/dist/reset.css";
import {store} from "./redux/store";
import {Provider} from "react-redux"; // Import Ant Design styles

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
