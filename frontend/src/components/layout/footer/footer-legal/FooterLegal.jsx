import React from "react";
import "./footer-legal.scss";
import { Text } from "@/components/texts";
import FooterLegalItem from "../footer-legal-item/FooterLegalItem";
import { items } from "./footer-legal.config.js";

const FooterLegal = () => {
    return (
        <div className="footer-legal">
            <Text className="footer-legal__title" variant="p">Legales</Text>
            <ul className="footer-legal__list">
                {items.map((item, index)=>(
                    <FooterLegalItem item={item} key={index}/>
                ))}
            </ul>
        </div>
    );
};

export default FooterLegal;