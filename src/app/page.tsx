"use client";

import { Globe, Phone } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";
import { SolaceHeader } from "./solace-header";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
  createdAt: string;
}

interface SearchPanelProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchPanel({
  onChange,
}: SearchPanelProps): JSX.Element {
  return (
    <div className="mb-4 rounded-md shadow-xl py-4 px-8 mt-4 bg-green-300 ">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, city, degree, specialties..."
            className="w-full px-6 py-4 pl-14 pr-6 text-base text-bodyFontDark rounded-md bg-green-100 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={onChange}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6" fill="none" stroke="gray" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

function AdvocateRow({ advocate }: { advocate: Advocate }): JSX.Element {
  const formatPhoneNumeber = (phoneNumber: string) => {
    // Format as (123) 456-7890
    const cleaned = (String(phoneNumber)).replace(/\D/g, ''); // Strip non-digit characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match 10 digits in three groups (3, 3, 4)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`; // Format as phone number (parentheses and dash)
    }
    return phoneNumber;
  };

  return (
    <div
      key={advocate.id}
      className="transition-colors duration-200 border-b hover:bg-opal px-8"
    >
      <div className="flex items-center justify-between pt-6">
        <div className="flex flex-column items-center justify-start">
          <h3 className="inline text-xl font-semibold">{advocate.firstName} {advocate.lastName}</h3>
          <span className="pl-2 text-lg">{advocate.degree}</span>

        </div>
        <div className="text-md font-semibold"><Phone className="inline h-4 text-green-500 pr-2 mt-[-2px]" />{formatPhoneNumeber(advocate.phoneNumber)}</div>
      </div>
      <div className="text-md pt-1 text-green-500">
        <span className="font-semibold">{`${advocate.yearsOfExperience} ${Number(advocate.yearsOfExperience) > 1 ? 'years' : 'year'} experience`}</span>
        <span className="pl-4 text-md"><Globe className="inline h-[14px] mt-[-2px]" />{advocate.city}</span>
      </div>

      <div>
        <h4 className="w-full text-md font-medium mt-2  text-bodyText">Specialties:</h4>
        <div className="flex flex-wrap pl-2 gap-2 py-4">
          {advocate.specialties.sort().map((specialty) => (
            <span
              key={specialty}
              className="inline-flex items-center px-3 py-1 text-bodyText rounded-full text-xs font-medium bg-green-100"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [offset, setOffset] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageHistory, setPageHistory] = useState<(string | null)[]>([null]); // Track offset for previous pages
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 5; // Artificially low to show pagination.

  const fetchAdvocates = useCallback(async (offset: string | null = null, isNewSearch = false, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', pageSize.toString());
      if (offset) {
        params.set('offset', offset);
      }
      if (search) {
        params.set('search', search);
      }

      const response = await fetch(`/api/advocates?${params}`);
      const jsonResponse = await response.json();

      if (isNewSearch) {
        setAdvocates(jsonResponse.data);
        setPageHistory([null]);
        setCurrentPage(0);
      } else {
        setAdvocates(jsonResponse.data);
      }

      setHasNextPage(jsonResponse.pagination.hasNextPage);
      setOffset(jsonResponse.pagination.nextOffset);
    } catch (error) {
      console.error('Failed to fetch advocates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  // Debounced search on searchTerm change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAdvocates(null, true, searchTerm); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchAdvocates]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const goToNextPage = () => {
    if (hasNextPage && offset !== null) {
      const newPageHistory = [...pageHistory, offset];
      setPageHistory(newPageHistory);
      setCurrentPage(currentPage + 1);
      fetchAdvocates(offset, false, searchTerm);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      const newPageHistory = pageHistory.slice(0, -1);
      setPageHistory(newPageHistory);
      setCurrentPage(currentPage - 1);
      const prevOffset = newPageHistory[newPageHistory.length - 1];
      fetchAdvocates(prevOffset, false, searchTerm);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-green-100">
        <SolaceHeader />
        <SearchPanel onChange={onSearchChange} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading advocates...</div>
          </div>
        )}

        <div className="bg-white rounded-md shadow-xl">
          <div >
            {advocates.map((advocate) => (
              <AdvocateRow key={advocate.id} advocate={advocate} />
            ))}

            {advocates.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                No advocates found. Try adjusting your search.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t">
            <div className="flex items-center text-sm text-gray-700">
              <span>Page {currentPage + 1}</span>
              {searchTerm && (
                <span className="ml-2 text-green-600">
                  (filtered by: &ldquo;{searchTerm}&rdquo;)
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === 0
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={!hasNextPage}
                className={`px-4 py-2 text-sm font-medium rounded-md ${!hasNextPage
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-white bg-green-500 hover:bg-green-700'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
