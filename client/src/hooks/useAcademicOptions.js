import { useCallback, useEffect, useState } from 'react';

const API_URL = '/api';

const fetchJson = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Unable to load ${path}`);
  return Array.isArray(data) ? data : [];
};

const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const value = query.toString();
  return value ? `?${value}` : '';
};

export const useAcademicOptions = ({ department = '', course = '', semester = '' } = {}) => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    let active = true;

    fetchJson('/departments')
      .then((data) => {
        if (active) setDepartments(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;

    if (!department) {
      setCourses([]);
      return undefined;
    }

    fetchJson(`/courses${buildQuery({ department })}`)
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch((err) => {
        if (active) {
          setCourses([]);
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, [department, refreshKey]);

  useEffect(() => {
    let active = true;

    if (!course) {
      setSemesters([]);
      return undefined;
    }

    fetchJson(`/semesters${buildQuery({ department, course })}`)
      .then((data) => {
        if (active) setSemesters(data);
      })
      .catch((err) => {
        if (active) {
          setSemesters([]);
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, [department, course, refreshKey]);

  useEffect(() => {
    let active = true;

    if (!semester) {
      setSubjects([]);
      return undefined;
    }

    fetchJson(`/subjects${buildQuery({ department, course, semester })}`)
      .then((data) => {
        if (active) setSubjects(data);
      })
      .catch((err) => {
        if (active) {
          setSubjects([]);
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, [department, course, semester, refreshKey]);

  return {
    departments,
    courses,
    semesters,
    subjects,
    error,
    refresh,
  };
};

export default useAcademicOptions;
