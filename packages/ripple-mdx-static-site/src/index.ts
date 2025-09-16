import { mount } from 'ripple';
// @ts-expect-error: known issue, we're working on it
import App from './App.ripple';
import { createHashRouterApp } from "ripple-router-hash";



createHashRouterApp({
	target: document.getElementById('root'),
})