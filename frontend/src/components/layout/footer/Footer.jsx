import { Text } from "@/components/texts";
import FooterExplorer from "./footer-explorer/FooterExplorer";
import FooterLegal from "./footer-legal/FooterLegal";
import FooterSocialMedia from "./footer-social-media/FooterSocialMedia";
import "./footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer_content">
                <FooterExplorer />
                <FooterLegal />
                <FooterSocialMedia />
            </div>
            <Text className="footer_copyright" variant="p">
        &copy; 2025 Todos los derechos reservados
            </Text>
        </footer>
    );
};

export default Footer;