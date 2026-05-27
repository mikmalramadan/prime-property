import { createClient } from '@supabase/supabase-js'

// Using Node 20+ --env-file flag makes process.env available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const KAWASAN = [
  'Krakatau', 'Pancing', 'Tembung', 'Helvetia',
  'Cemara Asri', 'Kuala', 'Sunggal', 'Marelan',
]
const HADAP = ['Utara', 'Selatan', 'Timur', 'Barat']
const TIPE = ['Ruko', 'Villa']
const STATUS = ['in_stock', 'sold_out']
const SIAP = ['siap_huni', 'siap_kosong', 'siap_huni_renovasi']

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomItems(arr, max) {
  const count = Math.floor(Math.random() * max) + 1
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function runSeed() {
  console.log("🌱 Starting Seed...")

  // 1. Create a Superadmin User
  const adminEmail = 'superadmin@primeproperty.id'
  const adminPassword = 'SuperAdmin123!'
  
  console.log(`Creating superadmin: ${adminEmail}`)
  
  let adminId = null
  
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers()
  const existingUser = userList?.users.find(u => u.email === adminEmail)

  if (existingUser) {
    console.log("Superadmin already exists. Updating password...")
    adminId = existingUser.id
    await supabase.auth.admin.updateUserById(adminId, { password: adminPassword })
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    })
    
    if (createErr) {
      console.error("Failed to create superadmin:", createErr)
      process.exit(1)
    }
    adminId = newUser.user.id
  }

  // Check if profile exists, if not create it
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', adminId).single()
  if (!profile) {
    await supabase.from('profiles').insert({
      id: adminId,
      email: adminEmail,
      role: 'superadmin',
      is_active: true
    })
  } else {
    await supabase.from('profiles').update({ role: 'superadmin' }).eq('id', adminId)
  }
  console.log("Superadmin profile ready!")

  // 1.5 Create a standard Admin User
  const stdAdminEmail = 'admin@primeproperty.id'
  const stdAdminPassword = 'Admin123!'
  console.log(`Creating admin: ${stdAdminEmail}`)
  
  const existingStd = userList?.users.find(u => u.email === stdAdminEmail)
  let stdAdminId = null

  if (existingStd) {
    console.log("Admin already exists. Updating password...")
    stdAdminId = existingStd.id
    await supabase.auth.admin.updateUserById(stdAdminId, { password: stdAdminPassword })
  } else {
    const { data: newStdUser, error: stdCreateErr } = await supabase.auth.admin.createUser({
      email: stdAdminEmail,
      password: stdAdminPassword,
      email_confirm: true
    })
    
    if (stdCreateErr) {
      console.error("Failed to create admin:", stdCreateErr)
    } else {
      stdAdminId = newStdUser.user.id
    }
  }

  if (stdAdminId) {
    const { data: stdProfile } = await supabase.from('profiles').select('*').eq('id', stdAdminId).single()
    if (!stdProfile) {
      await supabase.from('profiles').insert({
        id: stdAdminId,
        email: stdAdminEmail,
        role: 'admin',
        is_active: true
      })
    } else {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', stdAdminId)
    }
    console.log("Admin profile ready!")
  }

  // 2. Clear existing dummy properties (optional, to avoid huge duplicates)
  // We'll just generate 50 new ones.

  const properties = []
  
  for (let i = 1; i <= 55; i++) {
    const tipe = getRandomItem(TIPE)
    const kawasan = getRandomItems(KAWASAN, 2)
    const price = getRandomInt(8, 50) * 100000000 // 800jt - 5M
    const isSold = Math.random() > 0.7 // 30% chance sold out

    properties.push({
      nama_property: `${tipe} ${getRandomItem(['Mentari', 'Indah', 'Permai', 'Asri', 'Grand', 'Royal', 'City'])} ${i}`,
      group_name: Math.random() > 0.5 ? `Group ${getRandomItem(['A', 'B', 'C', 'X', 'Y', 'Z'])}` : null,
      unit: `Blok ${getRandomItem(['A', 'B', 'C', 'D'])}-${getRandomInt(1, 20)}`,
      lebar: getRandomInt(4, 10),
      panjang: getRandomInt(10, 25),
      tingkat: getRandomItem([1, 1.5, 2, 2.5, 3]),
      price: price,
      tipe: tipe,
      status: isSold ? 'sold_out' : 'in_stock',
      siap: getRandomItem(SIAP),
      carport: Math.random() > 0.3,
      hadap: getRandomItems(HADAP, 2),
      kawasan: kawasan,
      maps_link: Math.random() > 0.5 ? 'https://maps.app.goo.gl/dummy' : null,
      created_by: adminId
    })
  }

  console.log(`Inserting ${properties.length} dummy properties...`)
  
  // Insert in chunks of 10 to avoid any limits
  for (let i = 0; i < properties.length; i += 10) {
    const chunk = properties.slice(i, i + 10)
    const { error: insertErr } = await supabase.from('properties').insert(chunk)
    if (insertErr) {
      console.error("Error inserting properties:", insertErr)
    } else {
      console.log(`Inserted ${i + chunk.length}/${properties.length}`)
    }
  }

  console.log("✅ Seed completed successfully!")
}

runSeed().catch(console.error)
