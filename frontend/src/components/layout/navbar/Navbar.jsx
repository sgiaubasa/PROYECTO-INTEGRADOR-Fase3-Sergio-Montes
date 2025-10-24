import { Menu } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import { useState } from "react";
import NavbarList from "./navbar-list/NavbarList";
import "./navbar.scss";

const Navbar = () => {
    const [ openDrawer, setOpenDrawer ] = useState(false);

    const onClickOpenDrawer = () => setOpenDrawer(true);
    const onClickCloseDrawer = () => setOpenDrawer(false);

    return (
        <nav className="navbar">
            {/* Icono del menú hamburguesa (solo visible en mobile) */}
            <Menu className="navbar_menu-icon" onClick={onClickOpenDrawer} />

            {/* Menú normal (visible en desktop) */}
            <NavbarList className="navbar_menu-list" />

            {/* Drawer lateral para móviles */}
            <Drawer
                className="navbar_menu-drawer"
                open={openDrawer}
                anchor="left"
                onClose={onClickCloseDrawer}>
                <NavbarList onClick={onClickCloseDrawer} />
            </Drawer>
        </nav>
    );
};

export default Navbar;