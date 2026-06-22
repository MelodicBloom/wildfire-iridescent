import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {WebGLLayer} from './ClientComponents';
import './globals.css';
const inter=Inter({subsets:['latin'],display:'swap'});
export const metadata:Metadata={title:'Wildfire × Iridescent',description:'High-fidelity WebGL shader UI'};
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang='en'><body className={inter.className}><WebGLLayer/>{children}</body></html>);
}
