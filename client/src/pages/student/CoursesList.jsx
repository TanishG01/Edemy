import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {

    const {navigate, allCourses} = useContext(AppContext)
    const {input} = useParams()
    const [filteredCourse, setFilteredCourse] = useState([])
    const [searchText, setSearchText] = useState(input || '')

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()
            searchText 
                ? setFilteredCourse(tempCourses.filter(item => item.courseTitle.toLowerCase().includes(searchText.toLowerCase())))
                : setFilteredCourse(tempCourses)
        }
    }, [allCourses, searchText])

    const handleClear = () => {
        setSearchText('')
        navigate('/course-list')
    }

    return (
        <>
        <div className='relative md:px-36 px-8 pt-20 text-left'>
            <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                <div>
                    <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                    <p className='text-gray-500'>
                        <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span> / <span>Course List</span>
                    </p>
                </div>
                <SearchBar value={searchText} onChange={setSearchText} />
            </div>

            <div className='flex flex-col space-y-8 mt-8'>
                {searchText && (
                    <div className='inline-flex items-center gap-4 px-4 py-2 border text-gray-600 rounded-lg self-start'>
                        <p>{searchText}</p>
                        <img 
                            src={assets.cross_icon} 
                            alt="clear" 
                            className='cursor-pointer' 
                            onClick={handleClear} 
                        />
                    </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {filteredCourse.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default CoursesList
