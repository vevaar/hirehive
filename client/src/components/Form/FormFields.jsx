// src/components/ui/FormFields.js
import React from "react";

export const InputField = React.memo(({ id, label, value, onChange, required }) => (
  <div className='space-y-1'>
    <label className="typography-body">{label}*</label>
    <input
      id={id}
      type="text"
      placeholder={`Enter ${label.toLowerCase()}`}
      className='w-full p-2  rounded'
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
));

export const CustomDropdown = React.memo(({ field, label, options, value, onChange, isOpen, toggleDropdown, handleOptionClick }) => (
  <div className="space-y-1">
    <label className="typography-body">{label}*</label>
    <div className="relative focus:outline focus:outline-teal-400">
      <button
        type="button"
        onClick={() => toggleDropdown(field)}
        className="mt-1 h-[44px] bg-background-40 block text-font-gray w-full outline-none rounded-md shadow-sm focus:ring-teal-300 focus:border-teal-300 text-left px-4"
      >
        {options.find(opt => opt.value === value)?.label || '-Select-'}
      </button>
      {isOpen && (
        <ul className="absolute mt-1 bg-background-40 rounded-md shadow-lg w-full space-y-2 z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(field, option)}
              className="cursor-pointer px-4 py-2 hover:bg-background-60"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
));

export const ExperienceField = React.memo(({ formData, handleExperienceChange, incrementExperience, decrementExperience }) => (
  <div>
    <label className="typography-body">Experience*</label>
    <div className='flex gap-2'>
      {['From', 'To'].map((label) => (
        <NumberInputField
          key={label}
          label={label}
          value={formData[`experience${label}`]}
          onChange={(value) => handleExperienceChange(`experience${label}`, value)}
          onIncrement={() => incrementExperience(`experience${label}`)}
          onDecrement={() => decrementExperience(`experience${label}`)}
          unit="Yrs"
        />
      ))}
    </div>
  </div>
));

export const BudgetField = React.memo(({ formData, handleExperienceChange, incrementExperience, decrementExperience }) => (
  <div>
    <label className="typography-body">Budget*</label>
    <div className='flex gap-2'>
      {['From', 'To'].map((label) => (
        <NumberInputField
          key={label}
          label={label}
          value={formData[`budget${label}`]}
          onChange={(value) => handleExperienceChange(`budget${label}`, value)}
          onIncrement={() => incrementExperience(`budget${label}`)}
          onDecrement={() => decrementExperience(`budget${label}`)}
          unit="Lpa"
        />
      ))}
    </div>
  </div>
));

export const NumberInputField = React.memo(({ label, value, onChange, onIncrement, onDecrement, unit }) => (
  <div className='w-1/2'>
    <span className='typography-small-p text-font-gray'>{label}</span>
    <div className='items-center flex bg-background-40 rounded-xl'>
      <input
        type="number"
        placeholder='-Select-'
        className='outline-none no-spinner w-full p-2'
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className='flex gap-2 items-center'>
        <p className='typography-body text-font-gray'> {unit}</p>
        <button type="button" onClick={onDecrement}>-</button>
        <button type="button" onClick={onIncrement}>+</button>
      </div>
    </div>
  </div>
));