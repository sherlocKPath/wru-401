import React from 'react'

const Header = ({ category, title }) => {
  return (
    <div className="mb-10">
      <p>
        {category}
      </p>
      <p className="text-3xl font-extrabold tracking-tight">{title}</p>
    </div>
  )
}

export default Header