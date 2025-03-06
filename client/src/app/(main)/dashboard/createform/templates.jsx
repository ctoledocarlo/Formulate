import React from "react";

// Short Answer Question Component
export const ShortAnswerQuestion = ({ name, value, onChange }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Short Question"
      className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
    <input
      placeholder="Short answer field"
      disabled
      className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
  </div>
);

// Long Answer Question Component
export const LongAnswerQuestion = ({ name, value, onChange }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Long Question"
      className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
    <input
      placeholder="Long answer field"
      disabled
      className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
  </div>
);

// Multiple Choice Question Component
export const MultipleChoiceQuestion = ({ name, value, onChange, options, addOption }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="MC Question"
      className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />

    {options.map((option, index) => (
      <input
        key={index}
        type="text"
        value={option}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Option ${index + 1}`}
        className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA] mb-2"
      />
    ))}

    <button
      onClick={addOption}
      className="bg-[#6EACDA] text-[#0F0E47] px-4 py-1 rounded-lg shadow-md hover:bg-[#505081] transition duration-300 mt-2"
    >
      + Add Option
    </button>
  </div>
);

// Checkbox Question Component
export const CheckboxQuestion = ({ name, value, onChange, options, addOption }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Checkbox Question"
      className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />

    {options.map((option, index) => (
      <input
        key={index}
        type="text"
        value={option}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Checkbox ${index + 1}`}
        className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA] mb-2"
      />
    ))}

    <button
      onClick={addOption}
      className="bg-[#6EACDA] text-[#0F0E47] px-4 py-1 rounded-lg shadow-md hover:bg-[#505081] transition duration-300 mt-2"
    >
      + Add Checkbox
    </button>
  </div>
);

// Dropdown Question Component
export const DropdownQuestion = ({ name, value, onChange, options, addOption }) => (
    <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Dropdown Question"
        className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={`Dropdown Option ${index + 1}`}
          className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA] mb-2"
        />
      ))}
      <button onClick={addOption} className="bg-[#6EACDA] text-[#0F0E47] px-4 py-1 rounded-lg shadow-md hover:bg-[#505081] transition duration-300 mt-2">
        + Add Dropdown Option
      </button>
    </div>
  );

// Date Question Component
export const DateQuestion = ({ name, value, onChange }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Date Question"
      className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
    <input
      type="date"
      name={name + "_date"}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-1 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
    />
  </div>
);
