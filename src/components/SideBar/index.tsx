import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./burger-menu.css"; 

export function SideBar() {
  return (
    <Menu>
      <Link to="/profile" className="bm-item">Perfil</Link>
      <Link to="/profile" className="bm-item">Favoritos</Link>
    </Menu>
  );
}
