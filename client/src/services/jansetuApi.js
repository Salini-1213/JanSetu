import { analytics, industries, problems, universities } from "../data/jansetuMockData";

const wait = (value, delay = 180) => new Promise((resolve) => setTimeout(() => resolve(value), delay));
export const getProblems = () => wait(problems);
export const getProblemById = (id) => wait(problems.find((problem) => problem.id === id) || problems[0]);
export const getUniversityMatches = () => wait(universities);
export const getIndustryMatches = () => wait(industries);
export const getDashboardStats = () => wait(analytics);
export const submitProblem = (payload) => wait({ ...payload, id: `IND-2026-${String(Math.floor(Math.random() * 900000) + 100000)}` }, 500);
