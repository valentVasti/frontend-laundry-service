import React from 'react'
import TodayQueueChart from './TodayQueueChart'

const DashboardPage = () => {
    return (
        <section className='w-full h-auto'>
            <div className='w-full h-96 flex gap-5'>
                <div className='p-5 h-full w-3/5 bg-slate-100 rounded-2xl'>
                    <TodayQueueChart />
                </div>
                <div className='p-4 w-2/5 h-full bg-blue-100 rounded-2xl'>
                    aaa
                </div>
            </div>
        </section>
    )
}

export default DashboardPage