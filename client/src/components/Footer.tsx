export default function Footer() {
  return (
    <footer className="bg-blue-200 border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">About MediSage</h3>
            <p className="mt-2 text-sm text-gray-600">
              MediSage AI is an intelligent medical assistant that provides information about symptoms, treatments, and medications using advanced AI technology.
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Health Articles</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Medical Dictionary</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">First Aid Guides</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Find a Doctor</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Disclaimer</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} MediSage AI. All rights reserved. MediSage is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
