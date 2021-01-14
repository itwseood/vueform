import { createForm, findAllComponents, findAll } from 'test-helpers'
import useFormComponent from './../composables/useFormComponent'

describe('FormLanguageSelector', () => { 
  useFormComponent({multilingual:true,schema:{el:{type:'text'}}}, 'FormLanguageSelector')

  describe('select', () => {
    it('should select form language by clicking tab', () => {
      let form = createForm({
        languages: {
          en: {
            label: 'English',
            code: 'en'
          },
          de: {
            label: 'German',
            code: 'de'
          },
        },
        language: 'en',
        multilingual: true,
        schema: {
          name: {
            type: 't-text'
          }
        }
      })

      expect(form.vm.language).toBe('en')

      let tab = findAllComponents(form, { name: 'FormLanguageSelectorTab' }).at(1)
      let languageSelector = form.findComponent({ name: 'FormLanguageSelector' })

      findAll(tab, 'a').last().trigger('click')

      expect(form.vm.language).toBe('de')
      expect(languageSelector.vm.language).toBe('de')
    })
  })
})