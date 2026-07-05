# agenda-compartilhada-frontend

ShareHub - Frontend MVP 2

Repository created for the full development of the Frontend MVP - Advanced Frontend Development.

Web interface for managing shared agendas between users. Allows creating and managing activity groups, activities and schedules through a SPA (Single Page Application) built with React and TypeScript.

I------------------------------------------------------------------------------------------I

Technologies

React
TypeScript
Vite
React Router DOM
Tailwind3 CSS
Lucide React

I------------------------------------------------------------------------------------------I

Prerequisites

Node.js installed on your machine.
The ShareHub backend must be running before starting the frontend.
Backend repository: https://github.com/T-Quaresma/agenda-compartilhada-backend

Note: with the professor's authorization, this project uses the real backend from the previous MVP (FullStack Basico) instead of simulated data from a local JSON file.

I------------------------------------------------------------------------------------------I

Installation and Execution

1. Clone the repository:
git clone https://github.com/T-Quaresma/agenda-compartilhada-frontend
cd agenda-compartilhada-frontend
2. Install dependencies:
npm install
3. Make sure the backend is running:
cd agenda-compartilhada-backend
source venv/Scripts/activate
py app.py
4. Start the frontend:
npm run dev
5. Open the browser and navigate to:
http://localhost:5173

I------------------------------------------------------------------------------------------I

Features

Activity Groups

* Create new activity groups with custom avatar
* View all groups in the bottom navigation bar
* Select a group to filter activities
* Edit group name and avatar
* Delete groups with confirmation modal
* Move activities between groups

Activities

* Create new activities linked to a group with custom avatar
* View all activities in a responsive card grid
* Search activities by name
* Edit activity name, description and avatar
* Delete activities with confirmation modal

Schedules

* Create schedules linked to an activity
* Set start and end date, start and end time, location and frequency
* View schedules within each activity
* Edit all schedule details
* Delete schedules with confirmation modal
* Navigate directly to a schedule page by clicking on it

Navigation

* Bottom navigation bar with activity groups
* Horizontal scroll when more than 8 groups are created
* Return button on activity and schedule pages
* 404 page for unknown routes

Usability

* Tooltips on all buttons explaining their action
* Visual feedback after user actions (clicks, form submissions, loading states)
* Conditional messages for empty or error states (e.g. "no items found")
* Responsive layout, adapting to desktop and tablet screen sizes

I------------------------------------------------------------------------------------------I

Reusable Components

Header - Displayed on all pages
BottomNav - Displayed on all pages except 404, shows activity groups
ScheduleCard - Used in ActivityPage (compact mode) and SchedulePage (full mode)
Modal - Used for delete and edit confirmations across all pages
AvatarPicker - Used for selecting avatars for groups and activities

I------------------------------------------------------------------------------------------I

Routing and Navigation Hooks

Routing is handled with React Router DOM. The following hooks are used across the pages:

* useNavigate - used for redirecting between pages (e.g. after creating, editing or deleting an item)
* useParams - used to read route parameters, such as activity or schedule IDs, directly from the URL
* useLocation - used to read the current URL/route state across components
* useState / useEffect - used throughout the app to manage local component state and side effects (e.g. fetching data on mount)

A dedicated 404 route (NotFoundPage) handles any unmatched/unknown URLs.

I------------------------------------------------------------------------------------------I

Project Structure

src/
components/   - Reusable components (Header, BottomNav, ScheduleCard, Modal, AvatarPicker)
pages/        - Application pages (MainPage, ActivityPage, SchedulePage, SettingsPage, NotFoundPage)
services/     - API communication functions (atividade, agendamento, grupo, api)
assets/
avatars/      - Avatar images (SVG format, licensed under CC BY 4.0)

I------------------------------------------------------------------------------------------I

How to Use

1. Open the app — the Main Page shows the activity grid and the bottom navigation bar.
2. Create a group — click "New Group" in the bottom bar, choose a name and avatar.
3. Select a group — click a group card to filter activities by that group.
4. Create an activity — click "New Activity", fill in the name, description and avatar. If a group is selected, the activity will be linked to it automatically.
5. Open an activity — click any activity card to see its details and schedule list.
6. Create a schedule — inside an activity page, click "Create Schedule" and fill in the details.
7. Open a schedule — click any schedule card to see its full details, edit or delete it.
8. Edit or delete — use the Edit and Delete buttons on activity and schedule pages. Deleting always requires confirmation.
9. Move an activity to another group — click Edit on the activity and select a group from the "Move to Group" dropdown.
10. Delete a group — click the trash icon on the group card in the bottom bar. This does not delete the activities inside it.

I------------------------------------------------------------------------------------------I
Roadmap - Planned for MVP 3

The following features are part of the overall ShareHub project vision but are NOT implemented in this MVP 2 delivery. They are planned for MVP 3:

* User account creation and authentication (login/password)
* Sharing schedules/activities between users
* Participants - references to users with whom activities/schedules are shared
* Replace the current fixed avatar picker with the ability to upload custom images directly from the user's device, to be used instead of the predefined avatars

I------------------------------------------------------------------------------------------I

Credits

Avatars: Material Design 3 Kit, licensed under CC BY 4.0
https://creativecommons.org/licenses/by/4.0/

