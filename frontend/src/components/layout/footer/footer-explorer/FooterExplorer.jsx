import React from "react";
import "./footer-explorer.scss";
import { Text } from "@/components/texts";
import FooterExplorerItem from "../footer-explorer-item/FooterExplorerItem";
import { items } from "./footer-explorer.config.js";

const FooterExplorer = () => {
    return (
        <div className="footer-explorer">
            <Text className="footer-explorer__title" variant="p">Explorador</Text>
            <ul className="footer-explorer__list">
                {items.map((item, index)=>(
                    <FooterExplorerItem item={item} key={index}/>
                ))}
            </ul>
        </div>
    );
};

export default FooterExplorer;