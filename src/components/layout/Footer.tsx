import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, Compass, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090B0D] border-t border-[#292F36] text-[#B8BEC6] font-interface selection:bg-[#D9A752]/30 selection:text-[#D9A752]">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 space-y-12">
        
        {/* TOP BRAND AREA */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#090B0D] shadow-sm">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <span className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              GlobeTrotter
            </span>
          </div>

          <p className="font-editorial text-lg text-[#D9A752] italic font-normal">
            Plan the route. Make the memories.
          </p>

          <p className="text-sm sm:text-base text-[#B8BEC6] leading-relaxed max-w-2xl">
            A comprehensive travel intelligence and multi-destination itinerary platform. 
            Organize multi-city routes, plan day-by-day sightseeing, track live INR expenditures, 
            and share seamless journey timelines.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <a 
              href="https://github.com/Hetk8406/GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#111418] border border-[#292F36] text-xs font-semibold text-[#B8BEC6] hover:text-white hover:border-[#D9A752] transition-colors"
            >
              <span>GitHub Repository</span>
            </a>
            <span className="text-xs text-[#7F8791] flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-[#D9A752]" />
              <span>Odoo x LDCE Hackathon 2026</span>
            </span>
          </div>
        </div>

        {/* 4 VERTICAL NAVIGATION COLUMNS */}
        <div className="pt-10 border-t border-[#292F36] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* COLUMN 1: PRODUCT */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
              Product
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Itinerary Builder
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Trip Calendar
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Budget Planner
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Shared Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: EXPLORE */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
              Explore
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Asia
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Europe
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  India
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Americas
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Middle East
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Oceania
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PLAN YOUR TRIP */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
              Plan Your Trip
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Create a Trip
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Build an Itinerary
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Add Activities
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Track Expenses
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  View Timeline
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Share a Trip
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: ACCOUNT */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
              Account
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="text-[#B8BEC6] hover:text-white transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#D9A752] hover:text-[#C59643] font-bold transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-8 border-t border-[#292F36] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#7F8791]">
          <div className="space-y-1">
            <p className="m-0">© 2026 GlobeTrotter. All rights reserved.</p>
            <p className="m-0 text-[11px] text-[#7F8791]/80">Personalized multi-destination journey planning in INR.</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Shield className="h-3.5 w-3.5" />
              <span>Privacy Policy</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <FileText className="h-3.5 w-3.5" />
              <span>Terms of Service</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
