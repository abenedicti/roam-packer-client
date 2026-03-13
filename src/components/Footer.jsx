import githubEmoji from '../img/gitfooter.png';
import '../components/Footer.css';
function Footer() {
  return (
    <div className="footer">
      <p>
        <img src={githubEmoji} alt="github logo" />
        <a
          href="https://github.com/abenedicti/roam-packer-client"
          target="_blank"
        >
          Git repository
        </a>
      </p>
    </div>
  );
}
export default Footer;
