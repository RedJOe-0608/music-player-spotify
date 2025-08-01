/**
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */

import { useEffect, useState } from "react";

function useDebounce<T>(value: T,delay: number): T{
    const [debouncedValue,setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(()=>{
            setDebouncedValue(value)
        },delay)

        return () => clearTimeout(timer)
    },[value,delay])

    return debouncedValue
}

export default useDebounce