import { Dispatch, useState } from "react"

type Props = {
    setSubmittedUserDate: Dispatch<string>,
    setSubmittedUserLocation: Dispatch<string>,
    isFormSubmitted: boolean,
    setIsFormSubmitted: Dispatch<boolean>
}

export function StartTimeline({ setSubmittedUserDate, setSubmittedUserLocation, isFormSubmitted, setIsFormSubmitted }: Props) {
    const [userDateValue, setUserDateValue] = useState<string>('');
    const [userLocationValue, setUserLocationValue] = useState<string>('');
    
    function submitUserValues() {
        if (userDateValue.length !== 0 && userLocationValue.length !== 0) {
            setSubmittedUserDate(userDateValue);
            setSubmittedUserLocation(userLocationValue);
            
            setIsFormSubmitted(true);
        } else {
            alert('Please fill out all fields.');
        }
    }
    
    return (
        <>
            <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserLocationValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid" placeholder="Enter a location" />
            <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserDateValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid" placeholder="Enter a year"/>
            <button className="border-2 flex-grow" hidden={isFormSubmitted} type="submit" onClick={submitUserValues}>Submit</button>
        </>
    )
}