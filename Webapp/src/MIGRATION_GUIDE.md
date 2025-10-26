# 🚀 Guida Rapida alla Migrazione - v1.1.0

## Cosa è cambiato?

Il sistema è stato aggiornato per utilizzare **tabelle database dedicate** invece di una tabella generica key-value. Questo migliora performance, integrità dei dati e scalabilità.

### Prima (v1.0.1)
```
kv_store_2a12511d (tabella generica)
  ├─ candidate:email@example.com → JSON
  ├─ evaluation:eval-123 → JSON
  └─ evaluation_by_candidate:email → ID
```

### Dopo (v1.1.0)
```
candidates (tabella dedicata)
  ├─ id, name, email, phone_number, cv_text, ...
  
evaluations (tabella dedicata)
  ├─ id, evaluation_id, candidate_id (FK), job_id, ...
```

---

## ⚠️ Azione Richiesta

Per continuare a usare il sistema, devi creare le nuove tabelle nel database Supabase.

### Opzione 1: Setup Rapido (5 minuti)

1. **Vai al SQL Editor di Supabase**
   - Link: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new

2. **Copia e incolla questo SQL completo**
   
   Apri il file `/docs/DATABASE_SETUP.md` e copia lo script SQL completo che include:
   - Creazione tabelle `candidates` e `evaluations`
   - Indici per performance
   - Foreign keys
   - Row Level Security policies

3. **Clicca "Run"**

4. **Verifica nel Table Editor**
   - Link: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables
   - Dovresti vedere le tabelle `candidates` e `evaluations`

5. **Deploya la nuova Edge Function**
   ```bash
   supabase functions deploy make-server-2a12511d
   ```

6. **Testa nel Dashboard**
   - Attiva "Dati Reali" nel toggle
   - Verifica che non ci siano errori

### Opzione 2: Setup con Migrazione Dati (10 minuti)

Se hai già dati nella tabella `kv_store_2a12511d` che vuoi mantenere:

1. Segui i passi 1-2 dell'Opzione 1
2. Esegui anche lo **script di migrazione** in `/docs/DATABASE_SETUP.md` (sezione "Migrazione Dati")
3. Continua con i passi 5-6 dell'Opzione 1

---

## 🔍 Verifica che Tutto Funzioni

### Test 1: Connessione Database
```bash
# Test con curl
curl -X GET \
  'https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates' \
  -H 'Authorization: Bearer YOUR_PUBLIC_ANON_KEY' \
  -H 'apikey: YOUR_PUBLIC_ANON_KEY'

# Risposta attesa:
# {"ok":true,"candidates":[]}
```

### Test 2: Dashboard
1. Apri il dashboard
2. Attiva "Dati Reali"
3. Non dovresti vedere errori
4. Se hai migrato i dati, dovresti vedere i candidati esistenti

### Test 3: Nuova Candidatura
1. Apri una landing page di un ruolo
2. Compila e invia il form
3. Verifica che il candidato appaia nel dashboard
4. Verifica che appaia anche nel Table Editor di Supabase

---

## 📚 Documentazione

- **Setup Database Completo**: `/docs/DATABASE_SETUP.md`
- **Risoluzione Problemi**: `/docs/TROUBLESHOOTING.md`
- **Changelog**: `/CHANGELOG.md` (sezione v1.1.0)
- **README Generale**: `/docs/README.md`

---

## ❓ FAQ

### Q: Cosa succede se non migro subito?
**A:** Il sistema non funzionerà in modalità "Dati Reali". Vedrai errori tipo:
```
Error: relation "candidates" does not exist
```

### Q: Posso mantenere entrambe le strutture?
**A:** Tecnicamente sì, ma non è consigliato. Il sistema ora usa solo `candidates` e `evaluations`.

### Q: I miei dati vecchi andranno persi?
**A:** No! Se esegui lo script di migrazione, i tuoi dati saranno copiati dalla vecchia alla nuova struttura.

### Q: Posso eliminare kv_store_2a12511d?
**A:** Sì, dopo aver migrato i dati e verificato che tutto funzioni, puoi eliminarla con:
```sql
DROP TABLE IF EXISTS kv_store_2a12511d;
```

### Q: Ho problemi, dove trovo aiuto?
**A:** Consulta `/docs/TROUBLESHOOTING.md` per la guida completa alla risoluzione dei problemi.

---

## 🎯 Vantaggi della Nuova Struttura

✅ **Performance**: Indici ottimizzati per query veloci  
✅ **Integrità**: Foreign keys prevengono dati orfani  
✅ **Scalabilità**: Schema normalizzato per crescita futura  
✅ **Manutenibilità**: Campi tipizzati invece di JSONB generico  
✅ **Sicurezza**: RLS policies per accessi controllati  

---

## 🆘 Supporto

Se incontri problemi durante la migrazione:

1. Controlla i **log della console** (F12 nel browser)
2. Verifica i **log della Edge Function** in Supabase Dashboard
3. Consulta `/docs/TROUBLESHOOTING.md`
4. Verifica che le tabelle siano state create correttamente nel Table Editor

---

**Data Migrazione**: 26 Ottobre 2025  
**Versione**: 1.1.0  
**Tipo**: Breaking Change (richiede azione)
