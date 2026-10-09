import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { selectRole, selectUser } from '../../features/auth/authSelectors'
import { color } from '../../utility/color'
import { IconComponent, icons } from '../../components/IconComponent'

const ROLE_LABELS = {
  CUSTOMER: 'Customer',
  EMPLOYEE: 'Employee',
  AGENT: 'Agent',
}

const displayValue = (value) => {
  const text = value == null ? '' : String(value).trim()
  return text || 'Not available'
}

const roleLabel = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return 'Not available'
  const key = raw.toUpperCase()
  if (ROLE_LABELS[key]) return ROLE_LABELS[key]
  return raw
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const ProfileRow = ({ icon, label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: color.lightBlueBackground, alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent icon={icon} size={20} tintColor={color.primaryBlueDark} />
    </View>
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ fontSize: 12, color: color.secondaryText }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '600', color: color.mainText }}>{value}</Text>
    </View>
  </View>
)

const ProfileComponent = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const storedRole = useSelector(selectRole)

  const name = displayValue(user?.name || user?.fullName)
  const email = displayValue(user?.email)
  const role = roleLabel(user?.role || storedRole)
  const initial = name === 'Not available' ? 'U' : name.charAt(0).toUpperCase()

  const onLogoutPress = () => {
    Alert.alert('Log out', 'Do you want to log out of this account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => dispatch(logout()) },
    ])
  }

  return (
    <View style={{ flex: 1, paddingBottom: 110, gap: 16 }}>
      <View style={{ alignItems: 'center', paddingVertical: 8, gap: 8 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: color.primaryBlueDark, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: color.white }}>{initial}</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: color.mainText }}>{name}</Text>
        <View style={{ backgroundColor: color.lightBlueBackground, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: color.primaryBlueDark }}>{role}</Text>
        </View>
      </View>

      <View style={{ borderWidth: 1, borderColor: color.borderColor, borderRadius: 12, paddingHorizontal: 12 }}>
        <ProfileRow icon={icons.email} label="Email" value={email} />
        <View style={{ height: 1, backgroundColor: color.borderColor }} />
        <ProfileRow icon={icons.user} label="Role" value={role} />
      </View>

      <TouchableOpacity
        onPress={onLogoutPress}
        activeOpacity={0.85}
        style={{
          borderWidth: 1.5,
          borderColor: color.error,
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <IconComponent icon={icons.logoutf} size={18} tintColor={color.error} />
        <Text style={{ color: color.error, fontSize: 16, fontWeight: '700' }}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(ProfileComponent)
