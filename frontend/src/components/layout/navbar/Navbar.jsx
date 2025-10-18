import { Menu } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import { useState } from "react";
import NavbarList from "./navbar-list/NavbarList";
import "./navbar.scss";

const Navbar = () => {
    const [ openDrawer, setOpenDrawer ] = useState(false);

    const onClickOpenDrawer = () => {
        setOpenDrawer(true);
    };

    const onClickCloseDrawer = () => {
        setOpenDrawer(false);
    };

    return (
        <nav className="navbar">
            <Menu className="navbar__menu-icon" onClick={onClickOpenDrawer}/>
            <NavbarList className="navbar__menu-list"/>
            <Drawer
                className="navbar__menu-drawer"
                open={openDrawer}
                anchor="left"
                onClose={onClickCloseDrawer}>
                <NavbarList/>
            </Drawer>
        </nav>
    );
};

export default Navbar;