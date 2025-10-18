import { Text } from "@/components/texts";
import "./footer.scss";
import FooterExplorer from "./footer-explorer/FooterExplorer";
import FooterLegal from "./footer-legal/FooterLegal";
import FooterSocialMedia from "./footer-social-media/FooterSocialMedia";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <FooterExplorer/>
                <FooterLegal/>
                <FooterSocialMedia/>
            </div>
            <Text className="footer__copyright" variant="p">
                &copy;2025 Todos los derechos reservados
            </Text>
        </footer>
    );
};

export default Footer;