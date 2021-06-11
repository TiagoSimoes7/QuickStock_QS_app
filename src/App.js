import React from "react";
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Products from "./components/product/Products";
import EditProduct from "./components/product/EditProduct";
import CreateProduct from "./components/product/CreateProduct";
import ViewProduct from "./components/product/ViewProduct";
import DeletedProducts from "./components/product/DeletedProducts";
import Invoices from "./components/invoice/Invoices";
import EditInvoice from "./components/invoice/EditInvoice";
import CreateInvoice from "./components/invoice/CreateInvoice";
import ViewInvoice from "./components/invoice/ViewInvoice";
import ManageUsers from "./components/user/Users";
import CreateUser from "./components/user/CreateUser";
import EditUser from "./components/user/EditUser";
import ManageCompany from "./components/manage/Company";
import ProductTypes from "./components/productTypes/ProductTypes";
import CreateProductType from "./components/productTypes/CreateProductType";
import EditProductType from "./components/productTypes/EditProductType";
import CreateVuMark from "./components/vumark/create-vumark";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import SideBar from "./root/proSideBar";
import { ToastProvider } from 'react-toast-notifications';
const App = () => {
  return (
    <ToastProvider>
    <AuthProvider>
      <Router>
        <div className={"app"}>
          <SideBar exact component={SideBar} />
          <div id={'main'}>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <PrivateRoute exact path="/products" component={Products} />
              <PrivateRoute exact path="/viewProduct" component={ViewProduct} />
              <PrivateRoute exact path="/editProduct" component={EditProduct} />
              <PrivateRoute exact path="/createProduct" component={CreateProduct} />
              <PrivateRoute exact path="/deletedProducts" component={DeletedProducts} />
              <PrivateRoute exact path="/invoices" component={Invoices} />
              <PrivateRoute exact path="/viewInvoice" component={ViewInvoice} />
              <PrivateRoute exact path="/editInvoice" component={EditInvoice} />
              <PrivateRoute exact path="/createInvoice" component={CreateInvoice} />
              <PrivateRoute exact path="/manageUsers" component={ManageUsers} />
              <PrivateRoute exact path="/manageCompany" component={ManageCompany} />
              <PrivateRoute exact path="/createUser" component={CreateUser} />
              <PrivateRoute exact path="/editUser" component={EditUser} />
              <PrivateRoute exact path="/productTypes" component={ProductTypes} />
              <PrivateRoute exact path="/createProductType" component={CreateProductType} />
              <PrivateRoute exact path="/editProductType" component={EditProductType} />
              <PrivateRoute exact path="/createVuMark" component={CreateVuMark} />
          </div>
        </div>
      </Router>
    </AuthProvider>
    </ToastProvider>
  );
};

export default App;
