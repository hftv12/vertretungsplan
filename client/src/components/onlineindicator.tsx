import { useCallback, useEffect, useState } from "preact/hooks";
import Notice from "./notice";

export default function OnlineIndicator() {
    const [offline, setOffline] = useState(false);
    const offlineCallback = useCallback(() => {
        setOffline(!navigator.onLine);
    }, [setOffline]);
    
    useEffect(() => {
        offlineCallback();
        window.addEventListener("offline", offlineCallback);
        window.addEventListener("online", offlineCallback);
        return () => {
            window.removeEventListener("offline", offlineCallback);
            window.removeEventListener("online", offlineCallback);
        };
    }, [offlineCallback]);

    return (
        <div class={`notice-wrapper ${offline ? 'visible' : ''}`}>
           <Notice text="Notiz: Du bist offline." />
        </div>
    );
}