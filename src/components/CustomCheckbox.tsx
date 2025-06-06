import { useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const CustomCheckbox = () => {
    const [checked, setChecked] = useState(false);

    const toggleCheckbox = () => {
        setChecked((prev) => !prev);
    }

    return(
        <button onClick={toggleCheckbox} className="text-3xl">
            {checked ? <FaRegHeart className="text-amber-600" />: <FaHeart className="text-amber-600" />}
        </button>
    )
}