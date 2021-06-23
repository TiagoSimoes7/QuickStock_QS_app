import React, { useContext } from "react";
import { AuthContext } from "../Auth";
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaUserAlt, FaSignOutAlt, FaTruckLoading, FaExchangeAlt, FaUserTie } from 'react-icons/fa';
import app from "../base";
import { withRouter } from "react-router";

const SideBar = ({ history }) => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? (
    <ProSidebar breakPoint>
        <SidebarHeader style= {{cursor: 'pointer'}} onClick={() => history.push('/home')}>
        <div 
        style= {{display: 'flex'}}
        
        >
            <img
                style={{margin: 'auto', marginTop: '15px', marginBottom: '10px'}}
                alt=""
                src="../images/quickStockWhite.png"
                width="200"
                height="45"
                className="d-inline-block align-top"
                />
        </div>
        <div
          style={{
            paddingBottom: '10px',
            color: '#adadad',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }}
        >
          Company: {currentUser.companyInfo.name}
        </div>
      </SidebarHeader>

      <SidebarContent>
{/*         <Menu iconShape="circle">
          <MenuItem onClick={() => history.push('/products')} icon={<FaHeart />}>
            Products
          </MenuItem>
        </Menu> */}
        <Menu iconShape="circle">
          <SubMenu title={"Products"} icon={<FaTruckLoading />}>
            {/* TESTTTTT */}
            <MenuItem onClick={() => history.push('/products')}>Manage Products</MenuItem>
            <MenuItem onClick={() => history.push('/createProduct')}>Create new Product</MenuItem>
            <MenuItem suffix={<span className="badge gray">Comming</span>}> Create VuMark</MenuItem>
            <MenuItem onClick={() => history.push('/deletedProducts')}>Manage Deleted Products</MenuItem>
            {/* <MenuItem onClick={() => history.push('/productTypes')}>Manage Product Types</MenuItem> */}
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title={"Invoices"} icon={<FaExchangeAlt />}>
            <MenuItem onClick={() => history.push('/invoices')}>Manage Invoices</MenuItem>
            <MenuItem onClick={() => history.push('/createInvoice')}>Create new Invoice</MenuItem>
          </SubMenu>
        </Menu>
        {currentUser?.role !== 'Manager' ? 
        <Menu iconShape="circle">
          <SubMenu title={"Administration"} icon={<FaUserTie />}>
            <MenuItem onClick={() => history.push('/manageUsers')}>Manage Users</MenuItem>
            <MenuItem onClick={() => history.push('/createUser')}>Create User</MenuItem>
            {/* <MenuItem onClick={() => history.push('/manageCompany')}>Manage Company</MenuItem> */}
          </SubMenu>
        </Menu>
        : null}
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
        <button
        target="_blank"
        className="sidebar-btn"
        style={{border: 'none', maxWidth: '120px'}}
        rel="noopener noreferrer"
        onClick={() => history.push('/editUser')}
          >
            <FaUserAlt />
            <span style={{maxWidth: '100px', textOverflow: 'ellipsis', overflow: 'hidden'}}>{currentUser.email}</span>
          </button>
          <button
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
            style={{border: 'none'}}
            onClick={() => {app.auth().signOut(); history.push('/login')}}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
      </ProSidebar>) : null;
}

export default withRouter(SideBar);
