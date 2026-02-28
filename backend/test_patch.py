import sys
import fastapi._compat

# Monkey-patch the missing attributes in fastapi._compat
if not hasattr(fastapi._compat, "sequence_annotation_to_type"):
    fastapi._compat.sequence_annotation_to_type = lambda x: x
if not hasattr(fastapi._compat, "sequence_types"):
    fastapi._compat.sequence_types = (list, set, tuple)
if not hasattr(fastapi._compat, "ModelField"):

    class DummyModelField:
        pass

    fastapi._compat.ModelField = DummyModelField

try:
    from fastapi_amis_admin.admin.settings import Settings
    from fastapi_amis_admin.admin.site import AdminSite
    from fastapi_amis_admin.admin import admin

    print("Imported successfully with monkey patch")
except Exception as e:
    import traceback

    traceback.print_exc()
