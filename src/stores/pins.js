import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const usePinsStore = defineStore('pins', () => {
    const pins = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchPins() {
        loading.value = true
        error.value = null
        try {
            const { data, error: err } = await supabase
                .from('pins')
                .select('*')
                .order('created_at', { ascending: false })
            if (err) throw err
            pins.value = data
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function addPin({ cafeName, lat, lng, imageFile, userId }) {
        // 1. Upload image
        const ext = imageFile.name.split('.').pop()
        const filePath = `${userId}/${Date.now()}.${ext}`

        const { error: uploadErr } = await supabase.storage
            .from('pins')
            .upload(filePath, imageFile, { upsert: false })
        if (uploadErr) throw uploadErr

        // 2. Get public URL
        const { data: urlData } = supabase.storage
            .from('pins')
            .getPublicUrl(filePath)
        const imageUrl = urlData.publicUrl

        // 3. Insert row
        const { data, error: insertErr } = await supabase
            .from('pins')
            .insert({ user_id: userId, cafe_name: cafeName, lat, lng, image_url: imageUrl })
            .select()
            .single()
        if (insertErr) throw insertErr

        pins.value.unshift(data)
        return data
    }

    async function deletePin(id) {
        const { error: err } = await supabase
            .from('pins')
            .delete()
            .eq('id', id)
        if (err) throw err
        pins.value = pins.value.filter(p => p.id !== id)
    }

    return { pins, loading, error, fetchPins, addPin, deletePin }
})