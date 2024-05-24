// import React from 'react';
// import { useCookies } from 'react-cookie';
// import { Route, Redirect } from 'react-router-dom';

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);

//   <Route
//     {...rest}
//     render={(props) =>
//       cookies.__ADMINTOKEN__ ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to="/login" />
//       )
//     }
//   />
// );

// export default PrivateRoute;