import { Dispatch, useState } from "react"

type Props = {
    setSubmittedUserDate: Dispatch<string>,
    setSubmittedUserLocation: Dispatch<string>,
    setSubmittedUserTopic: Dispatch<string>,
    isFormSubmitted: boolean,
    setIsFormSubmitted: Dispatch<boolean>
}

export function StartTimeline({ setSubmittedUserDate, setSubmittedUserLocation, setSubmittedUserTopic, isFormSubmitted, setIsFormSubmitted }: Props) {
    const [userDateValue, setUserDateValue] = useState<string>('');
    const [userLocationValue, setUserLocationValue] = useState<string>('');
    const [userTopicValue, setUserTopicValue] = useState<string>('');
    
    function submitUserValues() {
        if (userDateValue.length !== 0 && userLocationValue.length !== 0 && userTopicValue.length !== 0) {
            setSubmittedUserDate(userDateValue);
            setSubmittedUserLocation(userLocationValue);
            setSubmittedUserTopic(userTopicValue);

            setIsFormSubmitted(true);
        } else {
            alert('Please fill out all fields.');
        }
    }
    
    return (
        <>
            {/* <div className={"flex flex-row w-full " + { "display:none" if isFormSubmitted}}> */}
                <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserLocationValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a location" />
                <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserDateValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a year" />
                <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserTopicValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a topic"/>
                <button className="border-2" hidden={isFormSubmitted} type="submit" onClick={submitUserValues}>Submit</button>
            {/* </div> */}
        </>
    )
}