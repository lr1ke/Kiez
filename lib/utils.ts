import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs:ClassValue[]) {return twMerge(clsx(inputs));}
export async function api<T>(path:string,data?:unknown):Promise<T> { const response=await fetch(`/api/${path}`,{method:data===undefined?'GET':'POST',headers:data===undefined?undefined:{'content-type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),cache:'no-store'});const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');return result; }
