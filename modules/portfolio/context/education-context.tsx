import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DegreeOption, Education } from '../../../@types';
import { notify } from '@ui/Toast';
import Portfolio from '../../../context/PortfolioLandingContext';

interface EducationModalContextType {
  educations: Education[];
  handleDeleteEducation: (id: string) => void;
  getAllEducation: () => void;
  addNewEducation: (education: Education) => void;
  handleEditEducation: (id: string) => void;
  degree: string;
  fieldOfStudy: string;
  description: string;
  school: string;
  from: string;
  to: string;
  selectedDegreeId: string | null;
  setSelectedDegreeId: (id: string | null) => void;
  handleDegreeSelection: (selectedDegree: string) => void;
  isForm: boolean;
  setFieldOfStudy: (text: string) => void;
  setDegree: (text: string) => void;
  setDescription: (text: string) => void;
  setSchool: (text: string) => void;
  setFrom: (text: string) => void;
  setTo: (text: string) => void;
  setIsForm: (value: boolean) => void; // Added
  resetForm: () => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isData: boolean;
  setIsData: (value: boolean) => void;
}

export const EducationModalContext = createContext<any>(null);

export const EducationModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [school, setSchool] = useState('');
  const [description, setDescription] = useState('');
  const [degreeOptions, setDegreeOptions] = useState<{ type: string; id: string }[]>([]);
  const [degree, setDegree] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isForm, setIsForm] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDegreeId, setSelectedDegreeId] = useState('');
  const [isData, setIsData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFieldOfStudy('');
    setDescription('');
    setSchool('');
    setFrom('');
    setDegree('');
    setTo('');
    setIsForm(true);
  };

  const { userId } = useContext(Portfolio);
  const setnewdegree = useCallback(async () => {
    fetch('https://hng6-r5y3.onrender.com/api/v1/degree')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.data) {
          setDegreeOptions(
            () => data.data?.map((item: DegreeOption) => ({ id: String(item.id), type: String(item.type) })),
          );
        }
      })
      .catch((error) => console.log({ error: error }));
  }, [userId]);

  useEffect(() => {
    setnewdegree();
  }, [userId]);

  const handleDegreeSelection = (selectedDegree: string) => {
    const selectedDegreeObject = degreeOptions && degreeOptions?.find((option) => option?.id === selectedDegree);
    if (selectedDegreeObject) {
      setSelectedDegreeId(selectedDegree);
    }
  };

  const API_BASE_URL = 'https://hng6-r5y3.onrender.com/';
  const [educations, setEducations] = useState<Education[] | []>([]);

  const handleEditEducation = async (e: React.FormEvent<HTMLFormElement>, educationId: number) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const updatedEducation = {
        degree, // You may need to add the degree information as well
        fieldOfStudy,
        id: educationId,
        school,
        description,
        from,
        to,
      };
      const response = await fetch(`${API_BASE_URL}api/v1/education/${educationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEducation),
      });
      if (response.ok) {
        notify({
          message: 'Education detail updated successfully',
          position: 'top-center',
          theme: 'light',
          type: 'success',
        });
        resetForm();
        setIsEditMode(false);
        setIsForm(false);
        setIsData(true);
        setEditingEducationId('');
        getAllEducation();
      } else {
      } // Request failed, handle the error
      console.error('Request failed with status:', response.status);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteEducation = async (educationId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/v1/education/${educationId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        notify({
          message: `Education Deleted successfully`,
          position: 'top-center',
          theme: 'light',
          type: 'success',
        });
        setEducations((prevEducations) => prevEducations.filter((education) => education.id !== educationId));
      }
    } catch (error) {
      console.error(error);
      notify({
        message: 'Was not able to delete education',
        position: 'top-center',
        theme: 'light',
        type: 'success',
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  // Extract the education IDs
  const getAllEducation = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/v1/getPortfolioDetails/${userId}`);

      if (response.ok) {
        const data = await response.json();
        const { education } = data;
        setEducations(education);
        // Extract the education IDs
        const educationIds = educations.map((education) => education.id);
      }
    } catch (error) {
      console.log('Error dey for here', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addNewEducation = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const missingFields = [];

      if (fieldOfStudy === '') {
        missingFields.push('fieldOfStudy');
      }
      if (school === '') {
        missingFields.push('school');
      }
      if (description === '') {
        missingFields.push('Description');
      }
      if (selectedDegreeId === '') {
        missingFields.push('Degree');
      }
      if (from === '') {
        missingFields.push('Start date');
      }
      if (to === '') {
        missingFields.push('End date');
      }

      if (from === to) {
        notify({
          message: `Start date and end date cant be the same`,
          position: 'top-center',
          theme: 'light',
          type: 'error',
        });
        return;
      }

      if (missingFields.length > 0) {
        // Handle the case when required values are missing
        const missingFieldsString = missingFields.join(', ');
        // Notify the user about missing fields
        notify({
          message: `Please fill in the required fields: ${missingFieldsString}`,
          position: 'top-center',
          theme: 'light',
          type: 'error',
        });
        return;
      }

      const year = new Date().getFullYear();
      const currYear = String(year);

      const response = await fetch(`${API_BASE_URL}api/v1/education/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({
          fieldOfStudy,
          // degreeOptions,
          degree_id: +selectedDegreeId,
          school,
          description,
          from,
          to,
          userId,
          section_id: 2,
        }),
      });
      if (response.ok) {
        getAllEducation();
        notify({
          message: 'Education detail created successfully',
          position: 'top-center',
          theme: 'light',
          type: 'success',
        });
        resetForm();
        setIsForm(false);
        setIsData(true);
      } else {
        // Request failed, handle the error
        console.error('Request failed with status:', response.status);
        notify({
          message: 'We had some issues adding ur Education detail',
          position: 'top-center',
          theme: 'light',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (userId.trim().length > 0) {
    getAllEducation();
    // }
  }, [getAllEducation]);

  return (
    <EducationModalContext.Provider
      value={{
        fieldOfStudy,
        degreeOptions,
        description,
        school,
        from,
        to,
        isForm,
        educations,
        isEditMode,
        isData,
        resetForm,
        setFieldOfStudy,
        setDegreeOptions,
        setDescription,
        setFrom,
        setSchool,
        setTo,
        handleDegreeSelection,
        handleDeleteEducation,
        getAllEducation,
        addNewEducation,
        handleEditEducation,
        setIsEditMode,
        setIsForm,
        setIsData,
        setSelectedDegreeId,
        selectedDegreeId,
        setnewdegree,
        editingEducationId,
        setEditingEducationId,
        isLoading,
      }}
    >
      {children}
    </EducationModalContext.Provider>
  );
};
