import React, { useEffect, useState } from "react"

const useMobile = (breakpoint = 768)=>{
    const [isMobile,setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleResize = ()=>{
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return ()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])

    return [ isMobile ]
}

export default useMobile

// This custom hook checks if the current window width is less than the specified breakpoint (default is 768px) and updates the state accordingly. It also adds an event listener to handle window resize events, ensuring that the state reflects the current window size.
// Usage: Import this hook in header and search component and call it to get the `isMobile` state, which will be `true` if the window width is less than the breakpoint, and `false` otherwise.
