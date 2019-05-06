import React from 'react'
import {Switch, Route} from 'react-router-dom'
import inject from './inject'

import Header from 'containers/Header'
import HomePage from 'containers/HomePage/Loadable'
import NotFoundPage from 'components/NotFoundPage/Loadable'
import LoadingSpinner from './LoadingSpinner'
import ErrorTrapper from './ErrorTrapper'

const App = () => [
	<Header key="header"/>,
	<Switch key="switch">,
		<Route exact path="/" component={HomePage}/>
		<Route path="/nopage" component={NotFoundPage}/>
	</Switch>,
	<ErrorTrapper key="error-trapper"/>,
	<LoadingSpinner key="loadingSpinner"/>
]

export default inject(App)
