import React, { useEffect, useState } from 'react'
import img2 from '../img/profile.jpg';

export default function Story() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const users = [
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 2, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
            { id: 1, displayName: 'dev_ahmen', photoURL: img2 },
        ]
        setUsers(users)
    })
    return (
        <div className="rounded-lg border border-gray-600 w-[290px] sm:w-[320px] md:w-full mx-auto overflow-auto py-4 px-6 ">
            <div className="flex gap-4">
                {users.map((user) => {
                    return (
                        <div key={user?.id} className="flex flex-col items-center">
                            <div
                                className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                style={{
                                    background: 'rgb(216, 221, 19)',
                                    backgroundImage:
                                        'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                }}
                            >
                                <img
                                    src={img2}
                                    layout="fill"
                                    objectFit="contain"
                                    alt=""
                                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                />
                            </div>
                            <div className="">Dev_ahmed</div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}
