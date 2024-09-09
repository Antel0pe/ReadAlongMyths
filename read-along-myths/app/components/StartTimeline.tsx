import { Dispatch, useState } from "react"

type Props = {
    setSubmittedUserTopic: Dispatch<string>,
    isFormSubmitted: boolean,
    setIsFormSubmitted: Dispatch<boolean>
}

export function StartTimeline({ setSubmittedUserTopic, isFormSubmitted, setIsFormSubmitted }: Props) {
    const [userTopicValue, setUserTopicValue] = useState<string>('');
    
    function submitUserValues() {
        if (userTopicValue.length !== 0) {
            setSubmittedUserTopic(userTopicValue);

            setIsFormSubmitted(true);
        } else {
            alert('Please fill out all fields.');
        }
    }
    
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex flex-row w-full">
                    <input 
                        type="text" 
                        hidden={isFormSubmitted} 
                        value={userTopicValue} 
                        onChange={(e) => setUserTopicValue(e.target.value)}
                        placeholder="Enter a historical topic, period, and location"
                        required 
                        className="flex-grow text-black border-4 border-green-500 border-solid min-w-0 p-2" 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitUserValues();
                            }
                        }}
                    />
                    <button 
                        className="border-2 px-4 py-2 bg-green-500 text-white" 
                        hidden={isFormSubmitted} 
                        type="submit" 
                        onClick={submitUserValues}
                    >
                        Submit
                    </button>
                </div>
            </div>
            {/* <div className={"flex flex-row w-full " + { "display:none" if isFormSubmitted}}> */}
                {/* <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserLocationValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a location" /> */}
                {/* <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserDateValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a year" /> */}
                {/* <input type="text" hidden={isFormSubmitted} onChange={(e) => setUserTopicValue(e.target.value)} required className="text-black border-4 border-green-500 border-solid min-w-0" placeholder="Enter a topic"/> */}
            {/* </div> */}
        </>
    )
}