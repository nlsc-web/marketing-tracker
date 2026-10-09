# Marketing Department Daily Tracker — සම්පූර්ණ Guide

මේ document එක app එක බලන, පාවිච්චි කරන, හෝ අලුතින් බාරගන්න කෙනෙකුට ලියලා තියෙන්නේ. Code එක full එක කියවලා app එක හදපු කෙනා දන්න දේම මෙතනින් තේරුම් ගන්න පුළුවන්. Screen එකේ පේන දේ, එයා පිටුපසින් වෙන දේ, කවුද මොකද කරන්න පුළුවන්ද, data එක කොහෙද යන්නේ කියලා එකට තියෙනවා.

App එකේ නම: **Marketing Department — Daily Numbers Tracker** (phone එකේ icon එකේ නම **MD Tracker**).

එක කතාවක්: marketing team එක දවසකට leads, calls, payments වගේ numbers ඇතුළත් කරනවා. ඒ numbers හැමෝගේම dashboard එකට යනවා. Manager කෙනෙක් බලන්න විතරයි පුළුවන්. Staff කෙනෙක් තමන්ගේ numbers විතරයි වෙනස් කරන්න පුළුවන්.

---

## වැඩ කරන විදිහ — step by step

පළවෙනි වතාවට එන කෙනා **A** ඉඳන් යනවා. දැනටමත් ගිණුම තියෙන staff කෙනා **C** ඉඳන් **G** දක්වා දවසක වැඩේ. Manager කෙනා **C** ඉඳන් login වෙලා **H** යනවා.

### A. App එක අරිනවා

1. Browser එකේ app එකේ link එක open කරනවා. Computer එකේ දුවනවා නම් `http://localhost:5500`.
2. **Marketing Department** login screen එක පේනවා.
3. ඊට කලින් login වෙලා, දවස් 7 ඇතුළත නම්, PIN අහන්නේ නැතුව ඇතුළට යනවා. නැත්නම් Sign In card එක ඉන්නවා.

### B. අලුත් කෙනෙක් ගිණුම හදනවා

ගිණුම නැති කෙනාට විතරයි. නම list එකේ තියෙනවා නම් මේක skip කරලා **C** යනවා.

1. **Create account** ඔබනවා.
2. **Name** එකට තමන්ගේ නම ලියනවා (අකුරු 2–40).
3. **PIN** එකට ඉලක්කම් 4ක් දානවා.
4. **Confirm PIN** එකට ඒකම ආපහු දානවා.
5. **Create Account** ඔබනවා.
6. නම අලුත් නම්, PIN එක හරි නම්, app එක ගිණුම හදලා ඒ විදිහටම ඇතුළට යනවා.
7. මේ ගිණුම staff (`entry`) ගිණුමක්. Numbers දාන්න පුළුවන්. Manager ගිණුමක් මෙතනින් හදන්න බෑ.
8. ඊළඟට login list එකේත් ඒ නම පේනවා.

වැරදුණොත් screen එකේම කියනවා: නම හිස්, PIN ඉලක්කම් 4 නෙවෙයි, PIN දෙක ගැලපෙන්නේ නෑ, නම දැනටමත් තියෙනවා.

### C. Login වෙනවා

1. **Name** dropdown එකෙන් තමන්ගේ නම තෝරනවා.
2. **PIN** එකට අංක 4 දානවා.
3. **Log In** ඔබනවා. Enter key එකෙන්ත් වෙනවා.
4. PIN හරි නම් ඇතුළත screen එක එනවා. උඩ දකුණේ “Logged in as” යටේ නම පේනවා.
5. PIN වැරදි නම් “Wrong PIN. Try again.” එකම නමට වැරදි PIN 5ක් දැම්මොත් මිනිත්තු 15ක් ඒ නම lock වෙනවා.

ඇතුළට ගියාම role එක අනුව screen එක වෙනස්:

- **Staff** නම් ඊළඟට **D**.
- **Manager** නම් form එක නෑ. ඊළඟට **H**.

### D. Staff — අද numbers දානවා

1. **Daily Entry** tab එක open වෙලා තියෙනවා.
2. **Coordinator** එකේ තමන්ගේ නම lock වෙලා පේනවා. වෙන කෙනෙක්ගේ නමට මාරු කරන්න බෑ.
3. **NLSC / COMPANY** එකෙන් course / workshop / service එක තෝරනවා. උදාහරණය: HR 5days Workshop.
4. **Date** එක අදට තියෙනවා. පරණ දවසකට දානවා නම් date එක මාරු කරනවා.
5. **Call metrics** පුරවනවා: Leads, Pickup Calls, Answer Calls, N/A Calls.
6. **Results** පුරවනවා: Payments Received, Sure Count, Follow up, Rejected Calls. නැති එක 0ම තියෙනවා.
7. **Save Entry** ඔබනවා.
8. “Entry Saved.” තත්පර 2ක් පේනවා.
9. Form එක හිස් වෙලා date එක ආපහු අදට යනවා.
10. පහළ **My Entries** එකේ අදට ඒ row එක පේනවා.

ඒ දවසේ තව department එකකට numbers තියෙනවා නම් පියවර 3–7 ආපහු කරනවා. එකම දවසට, එකම department එකටත් rows කිහිපයක් දාන්න පුළුවන්. දෙවෙනි එක පළවෙනි එක උඩින් replace වෙන්නේ නෑ.

Save එක ඔබපු ගමන් app එක මේවා කරනවා:

1. Row එකට අලුත් id එකක් දෙනවා.
2. Server එකට යවනවා. Coordinator නම login වුණු කෙනාගේ නමටම සෙට් වෙනවා.
3. Database එකේ save වෙනවා.
4. List එක server එකෙන් ආපහු අරගෙන පෙන්වනවා.
5. Dashboard එක ඊළඟට open කරන කෙනාටත් මේ numbers එකතු වෙනවා.

### E. Staff — දැමූ numbers බලනවා

1. Form එකට පහළ **My Entries** එක බලනවා.
2. උඩ **Date** එක default අද. අද දාපු ඒවා විතරයි පේනවා.
3. වෙන දවසක් ඕනේ නම් date එක මාරු කරනවා.
4. අදට යන්න **Today** ඔබනවා.
5. හැම දවසම බලන්න **All dates** ඔබනවා.
6. උඩ summary එකේ ඒ දවසේ Total Leads, Total Pickup, Payments, Sure Count පේනවා.
7. Pie chart එකේ ඒ දවසේ leads, department අනුව බෙදිලා පේනවා.
8. Table එකේ හැම row එකේම Leads, Pickup, Answer, N/A, Payments, Sure, Follow up, Rejected පේනවා.

තමන්ගේ rows විතරයි මෙතන පේනවා. වෙන staff කෙනාගේ table එක මෙතන නෑ. ඒ එකතුව **G** dashboard එකේ.

### F. Staff — වැරදුණු entry එකක් හදනවා හෝ මකනවා

හදන්න:

1. ඒ දවස filter එකෙන් තෝරනවා, row එක පේනවා.
2. ඒ පේළියේ **Edit** ඔබනවා.
3. Form එක උඩට එනවා. “Editing an existing entry” පේනවා. Button එක **Update entry** වෙනවා.
4. වැරදුණු number එක හදනවා.
5. **Update entry** ඔබනවා.
6. ඒ row එකම update වෙනවා. අලුත් row එකක් හැදෙන්නේ නෑ.
7. හදන්න එපා උනොත් **Cancel edit**. Form එක අලුත් entry එකකට ආපහු යනවා.

මකන්න:

1. ඒ පේළියේ **Delete** ඔබනවා.
2. “Delete this entry?” අහනවා.
3. ඔව් කිව්වොත් row එක මකනවා. ආපහු ගන්න බෑ.

වෙන කෙනාගේ row එකක Edit / Delete නෑ.

### G. Staff — team එකේ එකතුව බලනවා

1. **Dashboard** tab එක ඔබනවා.
2. Charts load වෙනවා. මේක තමන්ගේ numbers විතරක් නෙවෙයි. දැනට ඉන්න හැම staff කෙනාගේම එකතුව.
3. කාලයක් ඕනේ නම් **From** date එක සහ **To** date එක දානවා. Charts එකපාර අලුත් වෙනවා.
4. හැම දවසම බලන්න නම් දෙකම හිස් කරලා **Refresh** ඔබනවා.
5. උඩ **Total Leads** සහ **Total Pickup** බලනවා.
6. **Call Metrics** pie එකේ Leads, Pickup, Answer, N/A එකතුව.
7. **Results** pie එකේ Payments, Sure, Follow up, Rejected එකතුව.
8. **Coordinators Summary** එකේ කෙනා අනුව leads.
9. **NLSC / COMPANY Summary** එකේ department අනුව leads.

“All Coordinators” සහ “All NLSC / COMPANY” click කරන filter නෙවෙයි. Date දෙක විතරයි වෙනස් කරන්න තියෙන්නේ.

### H. Manager — team එක බලනවා

Manager login උනාම form එක නෑ. පළවෙනි tab එක **Team Details**.

1. Login (**C**).
2. **Team Details** එකේ අදට හැම staff කෙනාගේම block එකක් පේනවා: නම, totals, pie chart, table.
3. වෙන දවසක් ඕනේ නම් **Date** මාරු කරනවා. හැම දවසම ඕනේ නම් **All dates**.
4. Edit / Delete buttons නෑ. Numbers වෙනස් කරන්න බෑ.
5. **Dashboard** tab එකට ගිහින් **G** වගේම From / To දාලා එකතුව බලනවා. Manager dashboard එකත් staff dashboard එකත් එකම එක.

### I. Manager — staff කෙනෙක් ඉවත් කරනවා

කෙනෙක් ආයෙත් app එක පාවිච්චි කරන්නේ නැත්නම්.

1. **Team Details** එකේ **Accounts** card එක බලනවා.
2. ඒ නම අසල **Remove** ඔබනවා.
3. Confirm කරනවා.
4. ඒ නම login list එකෙන් යනවා.
5. ඒ කෙනාගේ පරණ numbers Team Details එකෙන් සහ Dashboard එකෙන් නොපේනවා.

Manager නමක් මෙතනින් ඉවත් කරන්න බෑ. Staff කෙනෙකුට වෙන කෙනෙක්ව Remove කරන්න බෑ. Accounts card එක staff ට පේන්නේවත් නෑ.

### J. එළියට යනවා හෝ ගිණුම මකනවා

එළියට යන්න:

1. උඩ දකුණේ **Log Out** ඔබනවා.
2. Login screen එකට එනවා. ඊළඟට PIN ඕනේ.

තමන්ගේ ගිණුමම මකන්න (staff සහ manager දෙන්නම):

1. **Delete my account** ඔබනවා.
2. Confirm කරනවා.
3. නම login list එකෙන් යනවා, එළියට වැටෙනවා.
4. අන්තිම manager කෙනාට මේක වැඩ කරන්නේ නෑ. Manager කෙනෙක්වත් ඉන්න ඕනේ.

---

## 1. App එකේ කොටස් දෙක

| කොටස | මොකක්ද | කාටද |
| --- | --- | --- |
| Login + Daily Entry + Dashboard | Browser එකේ පේන app එක | Team එක |
| Server + database | Numbers save වෙන තැන, PIN check වෙන තැන | App එකේ පිටුපස |

Browser එකෙන් file එක විවෘත කරලා වැඩ කරන්න බෑ. `npm start` කරලා server එක දුවනකොට විතරයි login වෙන්න පුළුවන්. Local එකේ address එක `http://localhost:5500`.

Phone එකකට home screen එකට add කරන්න පුළුවන් (PWA). ඒක app එකක් වගේ open වෙනවා. Internet නැතිව numbers save වෙන්නේ නෑ. Page එක පරණ version එකක් cache වෙලා තියෙන්න පුළුවන්; numbers සෑම විටම server එකෙන් එනවා.

---

## 2. ගිණුම් වර්ග දෙක

Login list එකේ නම දෙකක් නෙවෙයි. **Role** දෙකක් තියෙනවා. Screen එක මුළුමනින්ම role එක අනුව වෙනස් වෙනවා.

### Entry (staff / coordinator)

Numbers දාන කෙනා.

- Daily Entry form එක පේනවා.
- තමන්ගේ නම Coordinator ලෙස lock වෙලා. වෙන කෙනෙක්ගේ නමින් save කරන්න බෑ. Server එකත් නම server session එකෙන් ගන්නවා, form එකේ නම වෙනස් කළත්.
- තමන් save කරපු rows විතරයි list එකේ පේනවා, edit / delete කරන්න පුළුවන්.
- Dashboard එකේ **හැම staff කෙනාගේම** එකතුව පේනවා.
- වෙන staff කෙනෙක්ගේ account එක ඉවත් කරන්න බෑ.
- **Delete my account** එකෙන් තමන්ගේ login එකම ඉවත් කරන්න පුළුවන්.

අලුතින් **Create account** කළොත් role එක සැමවිටම `entry`. Manager account එකක් form එකෙන් හදන්න බෑ.

### Viewer (manager)

බලන කෙනා. Numbers දාන්නේ නෑ.

- Daily Entry form එක සඟවනවා.
- පළවෙනි tab එකේ නම **Team Details** වෙනවා. හැම staff කෙනාගේම entries එකට පේනවා.
- Edit / Delete buttons නෑ. Save උත්සාහ කළොත් server එක “View-only accounts cannot change entries” කියලා අවහිර කරනවා.
- **Accounts** card එක පේනවා. ඒකෙන් staff (`entry`) නම් login list එකෙන් ඉවත් කරන්න පුළුවන්.
- වෙන manager (`viewer`) කෙනෙක් ඉවත් කරන්න බෑ.
- තමන්ගේ account එක delete කරන්න පුළුවන්, නමුත් **අන්තිම manager** කෙනාව delete කරන්න බෑ. අවම වශයෙන් manager කෙනෙක් ඉන්න ඕනේ.

Header එකේ වාක්‍යයත් වෙනස්:

- Staff: “Log Daily Numbers — The Dashboard Updates for Everyone.”
- Manager: “View team numbers — dashboard updates for everyone.”

### මුල් ගිණුම්

Server එක පළවෙනි වතාවට දුවද්දී `data/users.json` නැත්නම් මේ නම් ස්වයංක්‍රීයව හැදෙනවා.

| නම | Role |
| --- | --- |
| Mrs.Lakmali | viewer (manager) |
| Ms.Sajini | viewer (manager) |
| Dinithi | entry |
| Tharusha | entry |
| Ruchira | entry |
| Nirmala | entry |
| Sumudu | entry |
| Minoshi | entry |
| Dilrukshi | entry |

PIN එක app එකේ ලියලා නෑ. Server එකේ hash එකක් විතරයි තියෙන්නේ. වැරදි PIN 5 වතාවක් දැම්මොත් ඒ නම + ඒ device/IP එක **මිනිත්තු 15ක්** lock වෙනවා. ඒක server restart කළාම මතකයෙන් යනවා (file එකක save වෙන්නේ නෑ).

Login එක සාර්ථක උනාම browser එකේ `mdt_sid` cookie එකක් දානවා. **දවස් 7ක්** තියෙනවා. ඊළඟට site එක open කළාම නැවත PIN අහන්නේ නෑ, ඒ cookie එක තාම valid නම්. Logout කළාම cookie එක මකනවා.

---

## 3. Login screen එක

### Sign in

1. **Name** dropdown එකෙන් නම තෝරනවා. List එක server එකේ ගිණුම් වලින් එනවා.
2. **PIN** — අංක 4ක්.
3. **Log In**.

Enter key එකෙන්ත් login වෙනවා.

පණිවිඩ:

- නම තෝරලා නැත්නම්: “Please select your name.”
- PIN වැරදියි / නම නෑ: “Wrong PIN. Try again.”
- 5 වතාවක් වැරදුණාම: “Too many attempts. Try again in 15 minutes.”
- Server එක නැතිනම්: “Could not log in. Is the server running?”

### Create account

**Create account** එකෙන් form එක මාරු වෙනවා.

- Name: අකුරු 2–40. වැඩිපුර spaces එක space එකක් වෙනවා.
- PIN: ඉලක්කම් 4ක් හරියටම.
- Confirm PIN එක ගැලපෙන්න ඕනේ.
- නම දැනටමත් තියෙනවා නම් (කුඩා/ලොකු අකුරු නොසලකා): “That name is already taken.”

හැදුණු ගමන් ඒ ගිණුමෙන් ඇතුළට යනවා. Role එක `entry`. ඊළඟට login list එකේත් ඒ නම පේනවා.

---

## 4. ඇතුළත තියෙන tabs

හැමෝටම tabs දෙකයි.

1. **Daily Entry** (manager ට **Team Details**)
2. **Dashboard**

Tab එක click කළාම ඒ panel එක load වෙනවා. Dashboard එක open කරනකොට charts අලුත් numbers වලින් ඇඳෙනවා.

උඩ දකුණේ:

- නමේ පළවෙනි අකුර avatar එකේ.
- “Logged in as …”
- **Delete my account**
- **Log Out**

---

## 5. Daily Entry — staff කෙනෙක් numbers දාන විදිහ

Form එකේ heading: **Today’s Entry**.

### Fields

| Field | තේරුම |
| --- | --- |
| Coordinator | Login වුණු නම. Dropdown එක disabled. වෙනස් කරන්න බෑ. |
| NLSC / COMPANY | Course / workshop / service එක. පහළ list එක. |
| Date | දවස. Default අද. පරණ දවසකටත් දාන්න පුළුවන්. |
| Leads | Leads ගණන |
| Pickup Calls | Pickup calls |
| Answer Calls | Answer වුණු calls |
| N/A Calls | N/A calls |
| Payments Received | Payments |
| Sure Count | Sure count |
| Follow up | Follow up |
| Rejected Calls | Rejected calls |

හැම number එකක්ම 0 ඉඳන් පටන් ගන්නවා. හිස් එකක් 0 විදිහට save වෙනවා.

### NLSC / COMPANY list එක

- Accounts Course
- Accounts Theory
- Accounts Practical
- Tax 1day Workshop
- HR 5days Workshop
- PT & CT 7days Programme
- HR & Payroll
- HR 1day Workshop
- Entrepreneurship Event
- Company Registration
- BO Form
- Vacancies
- Form 15
- Bags

එක දවසකට එක department එකට එක row එකක් විතර කියලා app එක බලන්නේ නෑ. එකම දවසට, එකම department එකට, එකම කෙනා entries කිහිපයක් save කරන්න පුළුවන්. ඒවා වෙනම rows.

### Save

**Save Entry** එබුවාම:

1. අලුත් id එකක් හැදෙනවා (`e` + වෙලාව + random).
2. Server එකට යනවා.
3. “Entry Saved.” තත්පර 2ක් පේනවා.
4. Form එක 0 වලට reset වෙනවා, date එක අදට යනවා, department එක list එකේ පළවෙනි එකට යනවා.
5. පහළ **My Entries** list එක refresh වෙනවා.

Server එක coordinator නම login වුණු කෙනාගේ නමටම සෙට් කරනවා. වෙන කෙනෙක්ගේ row එකක් update කරන්න උත්සාහ කළොත් “You can only edit your own entries”.

### Edit

My Entries table එකේ **Edit**:

- උඩ “Editing an existing entry” badge එක පේනවා.
- Button එක **Update entry** වෙනවා.
- **Cancel edit** පේනවා. ඒකෙන් form එක අලුත් entry එකකට ආපහු යනවා.
- පරණ row එකේ id එකම යවනවා. අලුත් row එකක් හැදෙන්නේ නෑ. ඒ row එක replace වෙනවා.
- Page එක උඩට scroll වෙනවා.

වෙන කෙනෙක්ගේ row එක edit කරන්න button එකම නෑ.

### Delete

**Delete** එබුවාම “Delete this entry?” අහනවා. ඔව් කිව්වොත් ඒ row එක database එකෙන් මකනවා. මකපු එක ආපහු ගන්න බෑ.

---

## 6. My Entries / Team Full Details

Form එකට පහළින් entries list එක.

### Date filter

- Default **අද**. Refresh කළත් අදටම filter වෙලා තියෙනවා.
- වෙන දවසක් තෝරන්න පුළුවන්.
- **Today** — අදට යනවා.
- **All dates** — date එක හිස් කරලා හැම දවසම පෙන්වනවා.

අදට entries නැත්නම් list එක හිස් වගේ පේනවා. ඒකෙන් data නැති කියලා අදහස් වෙන්නේ නෑ. **All dates** බලන්න.

### Staff ට පේන දේ

තමන්ගේ rows විතරයි, තෝරපු දවසට.

එක් එක් කෙනාට උඩ summary එකක්:

- Total Leads
- Total Pickup
- Payments
- Sure Count

ඊළඟට pie chart එකක්: **Leads by NLSC / COMPANY**. Pie එකේ කෑලි department අනුව leads එකතුව. Pickup, payments වගේ ඒ chart එකේ නෑ. ඒවා table එකේ තියෙනවා.

Table columns: NLSC / COMPANY, Leads, Pickup, Answer, N/A, Payments, Sure, Follow up, Rejected, Edit/Delete.

දවස අනුව group වෙනවා. අලුත් දවස උඩින්.

### Manager ට පේන දේ

හැම **දැනට ඉන්න** staff කෙනාගේම entries. එක් එක් නමට වෙනම block එකක් (chart + table). Edit/Delete නෑ.

වැදගත් නීතිය: list එකේ සහ dashboard එකේ පේන්නේ **දැනට `entry` role එකේ ඉන්න** කෙනන්ගේ rows විතරයි. Account එක remove කළාම ඒ කෙනාගේ පරණ numbers screen එකෙන් අතුරුදහන් වෙනවා. Database එකේ row එක තියෙන්න පුළුවන්, නමුත් app එක ඒවා ගණන් ගන්නේ නෑ. Login list එකේ නැති නම dashboard එකේත් නෑ.

Manager account එකකින් දැමූ entries නෑ, මොකද manager form එකම නෑ.

---

## 7. Accounts — manager විතරයි

**Accounts** card එක viewer login එකේ විතරයි පේනවා.

Staff නම් list එක + **Remove**.

Remove කළාම:

- ඒ නම login dropdown එකෙන් යනවා.
- ඒ කෙනාගේ session එක ඊළඟ request එකේදී වැඩ කරන්නේ නෑ (user list එකේ නැත්නම් cookie එක reject).
- ඒ කෙනාගේ පරණ entries UI එකෙන් නොපේනවා (උඩ කිව්ව වගේ).
- Manager නම් මෙතනින් ඉවත් කරන්න බෑ.

**Delete my account** (header, හැමෝටම):

- තමන්වම login list එකෙන් අයින් කරනවා, ඊට පස්සේ logout.
- අන්තිම manager නම් block: “Cannot remove the last manager account.”
- Staff කෙනෙක් වෙන කෙනෙක්ව මකන්න උත්සාහ කළොත්: “Only managers can remove other accounts.”

Account එක මැකුවා කියලා ඒ කෙනා save කරපු database rows ස්වයංක්‍රීයව මකන්නේ නෑ. පේන්න නවතිනවා විතරයි.

---

## 8. Dashboard

හැමෝටම එකම dashboard එක. Staff කෙනා තමන්ගේ numbers විතරයි Daily Entry එකේ දකිනවා, dashboard එකේ team එකම දකිනවා.

### Date range

- **From** date (`filterFrom`)
- **To** date (`filterTo`)
- **Refresh**

දෙකම හිස් නම් හැම දවසම. From විතරයි තියෙනවා නම් ඒ දවසේ සිට ඉස්සරහට. To විතරයි නම් ඒ දවස දක්වා. දෙකම තියෙනවා නම් අතර දවස්.

“All Coordinators” සහ “All NLSC / COMPANY” කියන්නේ ලේබල් විතරයි. ඒවා click කරලා filter කරන dropdown නෙවෙයි. Coordinator එකෙන් හෝ department එකෙන් වෙන් කරලා dashboard එක හරින්න බෑ. Date range එක විතරයි filter එක.

From/To වෙනස් කළාම charts එකපාර refresh වෙනවා.

### උඩ සංඛ්‍යා දෙක

- **Total Leads** — filter එකට වැටෙන හැම row එකේම leads එකතුව
- **Total Pickup** — ඒ වගේම pickup එකතුව

### Charts හතර

හැම chart එකක්ම pie. පැත්තේ නම + ගණන. Chart එක උඩ hover කළාම ගණන සහ ප්‍රතිශතය.

Data නැත්නම් අළු “No data” පෙත්තක්.

| Chart | මොකද බෙදෙන්නේ |
| --- | --- |
| Call Metrics | Leads, Pickup Calls, Answer Calls, N/A Calls — මුළු එකතු |
| Results | Payments Received, Sure Count, Follow up, Rejected Calls — මුළු එකතු |
| Coordinators Summary | Staff කෙනා අනුව **leads** එකතුව විතරයි |
| NLSC / COMPANY Summary | Department අනුව **leads** එකතුව විතරයි |

Coordinator chart එකේ සහ department chart එකේ ප්‍රතිශතය leads වලින්. Payments වලින් නෙවෙයි. Payments, sure, follow up, rejected කියන්නේ Results chart එකේ.

Coordinator වර්ණ (chart එකේ, මුල් නම් වලට):

| නම | වර්ණය |
| --- | --- |
| Dinithi | purple |
| Tharusha | red |
| Ruchira | green |
| Nirmala | rose |
| Sumudu | navy |
| Minoshi | olive |
| Dilrukshi | brown |

අලුතින් හදපු නමකට ඊළඟ වර්ණය list එක චක්‍රයෙන් යනවා. Department වලට වෙනම ස්ථිර වර්ණ තියෙනවා (උදාහරණයක්: Accounts Theory orange, Accounts Practical cyan, Bags violet).

---

## 9. එක entry එකක ඇතුළේ තියෙන දේ

Database row එකක් මේ වගේ.

| Field | තේරුම |
| --- | --- |
| id | අනන්‍ය අංකය. Edit කරද්දී මේකම යනවා. |
| date | `YYYY-MM-DD` |
| coordinator | Save කළ කෙනාගේ නම |
| department | NLSC / COMPANY |
| leads, answer, na, pickup, payments, sure, followup, rejected | Form එකේ numbers |
| needcall | පරණ field එකක්. Form එකේ නෑ. අලුත් save එකකදී 0. පරණ data වල අගයක් තියෙන්න පුළුවන්. Dashboard එක මේක පෙන්වන්නේ නෑ. |
| updatedAt | අන්තිම වෙනස් කළ වෙලාව |

Sort: දවස අලුත් එක උඩින්, ඊළඟට updatedAt.

---

## 10. කවුද මොකද කරන්න පුළුවන්ද

| ක්‍රියාව | Staff (entry) | Manager (viewer) |
| --- | --- | --- |
| Login / logout | ඔව් | ඔව් |
| අලුත් entry | ඔව්, තමන්ගේ නමින් | නෑ |
| තමන්ගේ entry edit / delete | ඔව් | නෑ |
| වෙන කෙනාගේ entry edit / delete | නෑ | නෑ |
| තමන්ගේ entries list | ඔව් | — |
| හැම staff entries එකට බලන්න | නෑ (dashboard totals විතරයි) | ඔව් (Team Details) |
| Dashboard | ඔව්, team එකම | ඔව්, team එකම |
| Staff account remove | නෑ | ඔව් |
| Manager account remove | නෑ | නෑ (තමන්ව delete කරන්න පුළුවන්, අන්තිම කෙනා නෙවෙයි නම්) |
| තමන්ගේ account delete | ඔව් | ඔව්, අන්තිම manager නෙවෙයි නම් |

Login නැතුව `/api/entries` අහන්න බෑ. “Login required”.

---

## 11. Data කොහෙද ඉන්නේ

### Entries (numbers)

- Local computer එකේ, `DATABASE_URL` නැත්නම්: SQLite file `data/tracker.db`.
- Production (Render) එකේ `DATABASE_URL` තියෙනවා නම්: Postgres (Neon හෝ Supabase). Redeploy කළත් data ඉන්නේ ඒ නිසා.
- `DATABASE_URL` නැතුව Render එකේ දුවනවා නම් SQLite තාවකාලික disk එකේ. Redeploy එකකදී numbers මැකෙන්න පුළුවන්.

Database හිස් නම් එක වතාවක් `data/seed-entries.json` load වෙනවා. දැනටමත් rows තියෙනවා නම් seed එක දාන්නේ නෑ. Seed එක පරණ උදාහරණ entries.

### Users (නම්, PIN hashes, roles)

Entries database එකේ නෙවෙයි. `data/users.json` file එකේ.

- File එක නැත්නම් මුල් නම් 9න් හැදෙනවා.
- Create account / Remove / Delete my account මේ file එක වෙනස් කරනවා.
- මේ file එක Postgres එකට යන්නේ නෑ. Server එකේ disk එකේ. Render free disk එක temporary නම්, redeploy එකකදී අලුතින් හැදපු ගිණුම් නැති වෙලා මුල් seed නම් ආපහු එන්න පුළුවන්. Entries Postgres එකේ තියෙනවා නම් ඒ numbers ඉන්නවා.

### Session secret

`SESSION_SECRET` environment variable එක (අකුරු 16+). නැත්නම් `data/.session-secret` file එකක් හැදෙනවා. Secret එක වෙනස් උනොත් හැමෝම ආපහු login වෙන්න ඕනේ. Production එකේ Render Environment එකේ `SESSION_SECRET` දාලා තියෙන්න ඕනේ.

---

## 12. PIN එක මාරු කරන විදිහ

App එක ඇතුළේ “change PIN” screen එකක් නෑ.

1. `node scripts/hash-pin.js 1234` වගේ command එකෙන් අලුත් hash එක ගන්න (1234 උදාහරණයක් විතරයි).
2. ඒ hash එක `data/users.json` එකේ ඒ කෙනාගේ `pinHash` එකට දාන්න. නැත්නම් මුල් ගිණුම් වලට `auth.js` එකේ `SEED_USERS` list එකේ. `users.json` දැනටමත් තියෙනවා නම් app එක කියවන්නේ ඒ file එක. `auth.js` වෙනස් කළාට පරණ `users.json` එක තියෙන තුරු PIN එක මාරු වෙන්නේ නෑ.
3. Server එක restart.

PIN එක කොහෙවත් plain text විදිහට save වෙන්නේ නෑ.

---

## 13. දවසක වැඩේ

සම්පූර්ණ පියවර උඩ **වැඩ කරන විදිහ — step by step** එකේ. Staff දවස: **C → D → E → G**. වැරදුණොත් **F**. Manager දවස: **C → H → G**. කෙනෙක් ඉවත් කරන්න **I**.

---

## 14. App එක හදලා තියෙන විදිහ (කෙටියෙන්)

කෙනෙක් code එක කියවනවා නම් මේ map එක.

| File | වැඩේ |
| --- | --- |
| `server.js` | Express server. Port `5500` හෝ `PORT`. API + HTML දෙන්නේ. |
| `auth.js` | Users, PIN (bcrypt), cookie session, lockout, role checks. |
| `db.js` | Entries. `DATABASE_URL` තියෙනවා නම් Postgres, නැත්නම් SQLite. |
| `marketing department/index.html` | Screens. |
| `marketing department/js/app.js` | Login, form, tables, charts, role අනුව UI. |
| `marketing department/css/style.css` | Look. |
| `marketing department/sw.js` | Service worker, cache name `md-tracker-v7`. App files cache. `/api/` කැඳවීම් cache කරන්නේ නෑ. |
| `marketing department/js/pwa.js` | Service worker register. |
| `marketing department/manifest.webmanifest` | Phone home screen. |
| `marketing department/js/firebase-config.js` | පරණ Firebase placeholder. App එක මේක පාවිච්චි කරන්නේ නෑ. Data යන්නේ Express + SQLite/Postgres. |
| `data/users.json` | සජීවී ගිණුම්. Git එකට දාන්නේ නෑ. |
| `data/tracker.db` | Local entries. Git එකට දාන්නේ නෑ. |
| `data/seed-entries.json` | හිස් database එකකට මුල් entries. |
| `scripts/hash-pin.js` | PIN එකකින් hash එක හදනවා. |
| `render.yaml` | Render deploy. Health check `/api/health`. |

### API

| Method | Path | කාටද | මොකද වෙන්නේ |
| --- | --- | --- | --- |
| GET | `/api/health` | ඕනම කෙනෙක් | Server + database ජීවතුරුද |
| GET | `/api/users` | ඕනම කෙනෙක් | නම සහ role විතරයි. PIN hash යන්නේ නෑ. |
| GET | `/api/me` | Login | දැන් login වෙලා ඉන්න කෙනා |
| POST | `/api/login` | — | `{ name, pin }` → cookie |
| POST | `/api/register` | — | `{ name, pin }` → entry user + cookie |
| POST | `/api/logout` | — | Cookie මකනවා |
| DELETE | `/api/users/:name` | Login | තමන්, නැත්නම් manager කෙනෙක් staff කෙනෙක්ව |
| GET | `/api/entries` | Login | හැම entries. UI එක පස්සේ staff නම් වලට filter කරනවා. |
| GET | `/api/entries/:id` | Login | එක entry එකක් |
| POST | `/api/entries` | Entry විතරයි | අලුත් හෝ තමන්ගේ id එක update (upsert) |
| PUT | `/api/entries/:id` | Entry විතරයි | Update. තිරය මේක භාවිතා කරන්නේ නෑ. Edit යන්නේ POST එකෙන්, එකම id එකත් එක්ක. |
| DELETE | `/api/entries/:id` | Entry විතරයි | තමන්ගේ row එක මකනවා |

වෙනත් ඕනම URL එකක් `index.html` එක ආපහු දෙනවා.

---

## 15. Local එකේ දුවන්න

```bash
npm install
npm start
```

Browser: http://localhost:5500

Node 22.5 හෝ ඊට වැඩි ඕනේ (`node:sqlite` නිසා).

Production: Render web service. Environment එකේ `DATABASE_URL` සහ `SESSION_SECRET`.

---

## 16. බලද්දී පටලවගන්න පුළුවන් දේවල්

මේවා bug නෙවෙයි. App එක හදලා තියෙන විදිහ.

1. **My Entries අදට filter.** අද දාලා නැත්නම් හිස්. All dates බලන්න.
2. **Dashboard එකේ “All Coordinators” click කරන්න බෑ.** ඒක ලේබල් එකක්. Filter එක date range එක විතරයි.
3. **Coordinator / department pies leads විතරයි.** Payments වෙන chart එකේ.
4. **Staff කෙනා වෙන කෙනාගේ විස්තර table එකේ දකින්නේ නෑ.** එකතුව dashboard එකේ දකිනවා.
5. **Remove කළ නමේ පරණ numbers UI එකෙන් යනවා**, database row එක තියෙනවා නම් ඒක තනියම ඉන්නවා.
6. **එකම දවස + එකම department එකට rows කිහිපයක්** තියෙන්න පුළුවන්. දෙවෙනි එක පළවෙනි එක replace කරන්නේ නෑ.
7. **needcall** form එකේ නෑ. පරණ rows වල විතරයි අදාළ වෙන්න පුළුවන්.
8. **අලුත් ගිණුම් `users.json` එකේ.** Postgres එක entries විතරයි. Redeploy එකකදී users file එක නැති වෙන්න පුළුවන්.
9. **Firebase file එක** project එකේ තියෙනවා, app එක ඒකට connect වෙන්නේ නෑ.
10. **වර්ණ list එකේ Form 39, Form 12, Form 13, Form 6, Form 3** තියෙනවා. අද dropdown එකේ ඒවා නෑ. පරණ entries වල ඒ නම් තියෙනවා නම් chart එකේ පේන්න පුළුවන්.
